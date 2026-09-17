import Clothing from "../models/clothing.model.js";
import Variant from "../models/variant.model.js";

export const getClothesAdmin = async (req, res, next) => {
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
            stock,
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
        // Discount
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
        // Price
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
        // Stock Filter
        // =========================
        let stockClothingIds = null;

        if (stock) {
            const stockVariants = await Variant.aggregate([
                {
                    $group: {
                        _id: "$clothing",
                        totalQuantity: {
                            $sum: "$quantity",
                        },
                    },
                },
            ]);

            if (stock === "low") {
                stockClothingIds = stockVariants
                    .filter((item) => item.totalQuantity > 0 && item.totalQuantity < 10)
                    .map((item) => item._id);
            }

            if (stock === "out") {
                stockClothingIds = stockVariants
                    .filter((item) => item.totalQuantity === 0)
                    .map((item) => item._id);
            }

            if (stock === "in") {
                stockClothingIds = stockVariants
                    .filter((item) => item.totalQuantity > 0)
                    .map((item) => item._id);
            }

            if (stockClothingIds) {
                filters._id = {
                    $in: stockClothingIds,
                };
            }
        }

        // =========================
        // Pagination
        // =========================
        const pageNumber = Math.max(
            Number(page) || 1,
            1
        );

        const limitNumber = Math.max(
            Number(limit) || 10,
            1
        );

        const skip =
            (pageNumber - 1) * limitNumber;

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
        // Main Query
        // =========================
        const [clothes, total] = await Promise.all([
            Clothing.find(filters)
                .populate("category")
                .skip(skip)
                .limit(limitNumber)
                .sort(sortQuery)
                .lean(),

            Clothing.countDocuments(filters),
        ]);

        // =========================
        // General Statistics
        // =========================
        const totalClothes =
            await Clothing.countDocuments();

        const activeClothes =
            await Clothing.countDocuments({
                active: true,
            });

        // =========================
        // Stock Statistics
        // =========================
        const stockStats = await Variant.aggregate([
            {
                $group: {
                    _id: "$clothing",
                    totalQuantity: {
                        $sum: "$quantity",
                    },
                },
            },
                {
                $group: {
                    _id: null,

                    lowStockCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        {
                                            $gt: [
                                                "$totalQuantity",
                                                0,
                                            ],
                                        },
                                        {
                                            $lt: [
                                                "$totalQuantity",
                                                10,
                                            ],
                                        },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    outOfStockCount: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$totalQuantity",
                                        0,
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ]);

        const lowStockCount =
            stockStats[0]?.lowStockCount || 0;

        const outOfStockCount =
            stockStats[0]?.outOfStockCount || 0;

        // =========================
        // Response
        // =========================
        return res.status(200).json({
            success: true,

            data: clothes,

            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(
                    total / limitNumber
                ),
            },

            totalClothes,
            activeClothes,
            lowStockCount,
            outOfStockCount,
        });

    } catch (err) {
        next(err);
    }
};