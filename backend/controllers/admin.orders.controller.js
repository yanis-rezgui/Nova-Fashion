import Order from "../models/order.model.js";
import { notifyAdmins } from "../services/notifications.service.js";

export const getAllOrders = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            tri = "all",
            startDate,
            endDate,
            sort = "newest",
        } = req.query;

        // =====================================================
        // Pagination
        // =====================================================

        const pageNumber = Math.max(Number(page) || 1, 1);

        const limitNumber = Math.max(Number(limit) || 10, 1);

        const skip = (pageNumber - 1) * limitNumber;


        // =====================================================
        // Date Filter
        // =====================================================

        const now = new Date();

        let dateFilter = {};

        const startOfDay = (date) => {
            const d = new Date(date);

            d.setHours(0, 0, 0, 0);

            return d;
        };

        const endOfDay = (date) => {
            const d = new Date(date);

            d.setHours(23, 59, 59, 999);

            return d;
        };

        if (tri === "today") {

            dateFilter.createdAt = {
                $gte: startOfDay(now),
                $lte: endOfDay(now),
            };

        }

        else if (tri === "yesterday") {

            const yesterday = new Date(now);

            yesterday.setDate(
                yesterday.getDate() - 1
            );

            dateFilter.createdAt = {
                $gte: startOfDay(yesterday),
                $lte: endOfDay(yesterday),
            };

        }

        else if (tri === "last_7_days") {

            const date = new Date(now);

            date.setDate(
                date.getDate() - 6
            );

            dateFilter.createdAt = {
                $gte: startOfDay(date),
                $lte: endOfDay(now),
            };

        }

        else if (tri === "last_30_days") {

            const date = new Date(now);

            date.setDate(
                date.getDate() - 29
            );

            dateFilter.createdAt = {
                $gte: startOfDay(date),
                $lte: endOfDay(now),
            };

        }

        else if (tri === "this_month") {

            const start = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );

            dateFilter.createdAt = {
                $gte: startOfDay(start),
                $lte: endOfDay(now),
            };

        }

        else if (tri === "last_month") {

            const start = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                1
            );

            const end = new Date(
                now.getFullYear(),
                now.getMonth(),
                0
            );

            dateFilter.createdAt = {
                $gte: startOfDay(start),
                $lte: endOfDay(end),
            };

        }

        else if (tri === "custom") {

            const customStart = new Date(startDate);
            const customEnd = new Date(endDate);

            if (
                !isNaN(customStart.getTime()) &&
                !isNaN(customEnd.getTime())
            ) {
                dateFilter.createdAt = {
                    $gte: startOfDay(customStart),
                    $lte: endOfDay(customEnd),
                };
            }
        }


        // =====================================================
        // Main Filters
        // =====================================================

        const filters = {
            ...dateFilter,
        };


        // =====================================================
        // Status
        // =====================================================

        const allowedStatuses = [
            "EN_PREPARATION",
            "EXPEDIEE",
            "LIVREE",
            "ANNULEE",
        ];

        if (
            status?.trim() &&
            allowedStatuses.includes(
                status.trim().toUpperCase()
            )
        ) {
            filters.status =
                status.trim().toUpperCase();
        }


        // =====================================================
        // Search
        // =====================================================

        if (search?.trim()) {

            const searchValue = search.trim();

            filters.$or = [
                {
                    firstName: {
                        $regex: searchValue,
                        $options: "i",
                    },
                },
                {
                    lastName: {
                        $regex: searchValue,
                        $options: "i",
                    },
                },
                {
                    phone: {
                        $regex: searchValue,
                        $options: "i",
                    },
                },
                {
                    wilaya: {
                        $regex: searchValue,
                        $options: "i",
                    },
                },
                {
                    "items.name": {
                        $regex: searchValue,
                        $options: "i",
                    },
                },
            ];
        }


        // =====================================================
        // Sorting
        // =====================================================

        let sortQuery = {
            createdAt: -1,
            _id: -1,
        };

        if (sort === "oldest") {
            sortQuery = {
                createdAt: 1,
                _id: 1,
            };
        }


        // =====================================================
        // Main Query
        // =====================================================

        const [orders, total] = await Promise.all([

            Order.find(filters)
                .skip(skip)
                .limit(limitNumber)
                .sort(sortQuery)
                .lean(),

            Order.countDocuments(filters),

        ]);


        // =====================================================
        // KPI Statistics
        //
        // IMPORTANT :
        // Les KPIs utilisent uniquement le filtre de date.
        // Ils ne dépendent pas du status/search de la liste.
        // =====================================================

        const stats = await Order.aggregate([

            {
                $match: dateFilter,
            },

            {
                $group: {
                    _id: null,

                    totalOrders: {
                        $sum: 1,
                    },

                    preparationOrders: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "EN_PREPARATION",
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    shippedOrders: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "EXPEDIEE",
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    deliveredOrders: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "LIVREE",
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    cancelledOrders: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "ANNULEE",
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    revenue: {
                        $sum: {
                            $cond: [
                                {
                                    $ne: [
                                        "$status",
                                        "ANNULEE",
                                    ],
                                },
                                {
                                    $add: [
                                        "$totalPrice",
                                        "$deliveryFee",
                                    ],
                                },
                                0,
                            ],
                        },
                    },

                    productsSold: {
                        $sum: {
                            $cond: [
                                {
                                    $ne: [
                                        "$status",
                                        "ANNULEE",
                                    ],
                                },
                                {
                                    $reduce: {
                                        input: "$items",
                                        initialValue: 0,
                                        in: {
                                            $add: [
                                                "$$value",
                                                "$$this.quantity",
                                            ],
                                        },
                                    },
                                },
                                0,
                            ],
                        },
                    },
                },
            },

        ]);


        const statistics = stats[0] || {
            totalOrders: 0,
            preparationOrders: 0,
            shippedOrders: 0,
            deliveredOrders: 0,
            cancelledOrders: 0,
            revenue: 0,
            productsSold: 0,
        };


        // =====================================================
        // Response
        // =====================================================

        return res.status(200).json({

            success: true,

            data: orders,

            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(
                    total / limitNumber
                ),
            },

            stats: {
                totalOrders:
                    statistics.totalOrders,

                preparationOrders:
                    statistics.preparationOrders,

                shippedOrders:
                    statistics.shippedOrders,

                deliveredOrders:
                    statistics.deliveredOrders,

                cancelledOrders:
                    statistics.cancelledOrders,

                revenue:
                    statistics.revenue,

                productsSold:
                    statistics.productsSold,
            },

        });

    } catch (err) {
        next(err);
    }
};



export const updateOrderStatus = async(req , res , next) => {

    try{

        const {status} = req.body;
        const orderId = req.params.id;

        const order = await Order.findById(orderId);

        if(!order){
            return res.status(404).json({
               success : false,
               message : "Error order not found"
            });
        }

        const validStatus = [
            "EN_PREPARATION",
            "EXPEDIEE",
            "LIVREE",
            "ANNULEE",
        ].includes(status);

      if(!validStatus){
        return res.status(400).json({
            success : false,
            message : "Error invalid status"
        });
      }

      const previousStatus = order.status;
      
      order.status = status;
      await order.save();

if (
    previousStatus !== "LIVREE" &&
    status === "LIVREE"
) {
    await notifyAdmins({
        title: "Commande livrée",
        message: `La commande de ${order.firstName} ${order.lastName} a été livrée.`,
        type: "ORDER_DELIVERED",
    });
}

if (
    previousStatus !== "ANNULEE" &&
    status === "ANNULEE"
) {
    await notifyAdmins({
        title: "Commande annulée",
        message: `La commande de ${order.firstName} ${order.lastName} a été annulée.`,
        type: "ORDER_CANCELLED",
    });
}

      return res.status(200).json({
        success : true,
        message : "Status updated successfully",
        data : order
      });

    }catch(err){
        next(err);
    }
}


export const deleteOrder = async(req , res , next) => {

    try{

        const orderId = req.params.id;

        const order = await Order.findById(orderId);

        if(!order){
            return res.status(404).json({
                success : false,
                message : "Error order not found"
            });
        }

        if (order.status !== "ANNULEE") {
            return res.status(400).json({
                success: false,
                message: "Only cancelled orders can be deleted",
            });
        }

        await Order.deleteOne({
            _id : orderId
        });

        return res.status(200).json({
            success: true,
            message : "Order deleted successfully"
        });
    }catch(err){
        next(err);
    }
}


