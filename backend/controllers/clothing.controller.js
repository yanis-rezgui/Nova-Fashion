import Clothing from "../models/clothing.model.js";
import Variant from "../models/variant.model.js";


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