import Clothing from "../models/clothing.model.js";
import Variant from "../models/variant.model.js";
import Order from "../models/order.model.js";

export const getClothes = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      gender,
      category,
      minPrice,
      maxPrice,
      search,
      discount,
      sort,
    } = req.query;

    const filters = {};

    // =========================
    // Gender
    // =========================
    if (
      gender?.trim() &&
      ["HOMME", "FEMME", "UNISEXE"].includes(
        gender.trim().toUpperCase()
      )
    ) {
      filters.gender = gender.trim().toUpperCase();
    }

    // =========================
    // Category
    // =========================
    if (category?.trim()) {
      filters.category = category.trim();
    }

    // =========================
    // Search
    // =========================
    if (search?.trim()) {
      filters.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // =========================
    // Discount Filter
    // =========================
    if (discount === "true") {
      filters.$expr = {
        $and: [
          { $ne: ["$discountPrice", null] },
          { $lt: ["$discountPrice", "$price"] },
        ],
      };
    }

    // =========================
    // Price Filter
    // =========================
    const min = Number(minPrice);
    const max = Number(maxPrice);

    const hasMin = !isNaN(min) && min >= 0;
    const hasMax = !isNaN(max) && max >= 0;

    if (hasMin || hasMax) {
      const priceQuery = {};

      if (hasMin) {
        priceQuery.$gte = min;
      }

      if (hasMax) {
        priceQuery.$lte = max;
      }

      filters.$or = [
        {
          discountPrice: {
            $ne: null,
            ...priceQuery,
          },
        },
        {
          discountPrice: null,
          price: priceQuery,
        },
      ];
    }

    // =========================
    // Sorting
    // =========================
    let sortQuery = {
      createdAt: -1,
      _id: -1,
    };

    if (sort === "asc_price") {
      sortQuery = {
        price: 1,
        _id: -1,
      };
    }

    if (sort === "desc_price") {
      sortQuery = {
        price: -1,
        _id: -1,
      };
    }

    if (sort === "new_arrival") {
      sortQuery = {
        createdAt: -1,
        _id: -1,
      };
    }

    // =========================
    // Pagination
    // =========================
    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.max(Number(limit) || 10, 1);

    const skip = (pageNumber - 1) * limitNumber;

    // =========================
    // Database Query
    // =========================
    const [clothes, total, totalClothes] = await Promise.all([
  Clothing.find(filters)
    .populate("category")
    .skip(skip)
    .limit(limitNumber)
    .sort(sortQuery)
    .lean(),

  // Nombre après filtres
  Clothing.countDocuments(filters),

  // Nombre total dans la base, sans filtres
  Clothing.countDocuments(),
]);

    return res.status(200).json({
  success: true,
  data: clothes,
  pagination: {
    page: pageNumber,
    limit: limitNumber,
    total,
    totalPages: Math.ceil(total / limitNumber),
  },
  totalClothes,
});
  } catch (err) {
    next(err);
  }
};

export const getCloth = async(req , res, next)  => {

    try{

        const clothId = req.params.id;

        const cloth = await Clothing.findById(clothId).populate("category");

        if(!cloth){
            return res.status(404).json({
                success : false,
                message : "Error cloth not found",
            });
        }

        const variants = await Variant.find({
                clothing : clothId
        })

        return res.status(200).json({
            success : true,
            message : "Clothing and variants got successfully",
            data : {
                cloth,
                variants
            }
        });
    }catch(err){
        next(err);
    }
}


export const getAccueilClothes = async (req, res, next) => {

    try {

        const [newArrivals, promotions] = await Promise.all([

            // =====================================================
            // 4 DERNIERS PRODUITS
            // =====================================================

            Clothing
                .find({
                    active: true
                })
                .sort({
                    createdAt: -1
                })
                .limit(4)
                .populate("category", "name"),


            // =====================================================
            // 4 PRODUITS EN PROMOTION
            // =====================================================

            Clothing
                .find({
                    active: true,
                    discountPrice: {
                        $exists: true,
                        $ne: null,
                        $gt: 0
                    }
                })
                .sort({
                    createdAt: -1
                })
                .limit(4)
                .populate("category", "name")

        ]);


        return res.status(200).json({
            success: true,
            data: {
                newArrivals,
                promotions
            }
        });

    } catch (error) {

        next(error);

    }

};



export const getRecommendedClothes = async (req, res, next) => {
  try {
    const recommendedClothes = await Order.aggregate([
      // =====================================================
      // 1. Ignorer les commandes annulées
      // =====================================================

      {
        $match: {
          status: {
            $ne: "ANNULEE",
          },
        },
      },

      // =====================================================
      // 2. Transformer items[] en documents individuels
      // =====================================================

      {
        $unwind: "$items",
      },

      // =====================================================
      // 3. Regrouper par vêtement
      // =====================================================

      {
        $group: {
          _id: "$items.clothing",

          totalOrdered: {
            $sum: "$items.quantity",
          },
        },
      },

      // =====================================================
      // 4. Trier par quantité vendue
      // =====================================================

      {
        $sort: {
          totalOrdered: -1,
        },
      },

      // =====================================================
      // 5. Garder uniquement les 4 premiers
      // =====================================================

      {
        $limit: 4,
      },

      // =====================================================
      // 6. Récupérer les informations du Clothing
      // =====================================================

      {
        $lookup: {
          from: "clothings",
          localField: "_id",
          foreignField: "_id",
          as: "clothing",
        },
      },

      // =====================================================
      // 7. Transformer clothing[] en objet
      // =====================================================

      {
        $unwind: "$clothing",
      },

      // =====================================================
      // 8. Ne pas recommander un produit désactivé
      // =====================================================

      {
        $match: {
          "clothing.active": true,
        },
      },

      // =====================================================
      // 9. Récupérer la catégorie
      // =====================================================

      {
        $lookup: {
          from: "categories",
          localField: "clothing.category",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },

      // =====================================================
      // 10. Format final
      // =====================================================

      {
        $project: {
          _id: "$clothing._id",
          name: "$clothing.name",
          description: "$clothing.description",
          gender: "$clothing.gender",
          price: "$clothing.price",
          discountPrice: "$clothing.discountPrice",
          images: "$clothing.images",
          active: "$clothing.active",

          category: {
            _id: "$category._id",
            name: "$category.name",
          },

          totalOrdered: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Recommended clothes fetched successfully",
      data: recommendedClothes,
    });
  } catch (error) {
    next(error);
  }
};