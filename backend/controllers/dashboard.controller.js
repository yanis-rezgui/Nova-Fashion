import Order from "../models/order.model.js";
import Variant from "../models/variant.model.js";

// =====================================================
// GET DASHBOARD DATA
// =====================================================

export const getDashboardData = async (req, res, next) => {

    try {

        const now = new Date();

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

        const startOfToday = startOfDay(now);
        const endOfToday = endOfDay(now);

        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        const last30DaysStart = startOfDay(
            new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29)
        );

        const last12MonthsStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);


        // =====================================================
        // KPIs GLOBAUX (toutes périodes confondues)
        // =====================================================

        const globalStatsAgg = await Order.aggregate([
            {
                $group: {
                    _id: null,

                    totalOrders: { $sum: 1 },

                    totalRevenue: {
                        $sum: {
                            $cond: [
                                { $ne: ["$status", "ANNULEE"] },
                                { $add: ["$totalPrice", "$deliveryFee"] },
                                0,
                            ],
                        },
                    },

                    totalProductsSold: {
                        $sum: {
                            $cond: [
                                { $ne: ["$status", "ANNULEE"] },
                                {
                                    $reduce: {
                                        input: "$items",
                                        initialValue: 0,
                                        in: { $add: ["$$value", "$$this.quantity"] },
                                    },
                                },
                                0,
                            ],
                        },
                    },

                    preparationOrders: {
                        $sum: { $cond: [{ $eq: ["$status", "EN_PREPARATION"] }, 1, 0] },
                    },
                    shippedOrders: {
                        $sum: { $cond: [{ $eq: ["$status", "EXPEDIEE"] }, 1, 0] },
                    },
                    deliveredOrders: {
                        $sum: { $cond: [{ $eq: ["$status", "LIVREE"] }, 1, 0] },
                    },
                    cancelledOrders: {
                        $sum: { $cond: [{ $eq: ["$status", "ANNULEE"] }, 1, 0] },
                    },
                },
            },
        ]);

        const globalStats = globalStatsAgg[0] || {
            totalOrders: 0,
            totalRevenue: 0,
            totalProductsSold: 0,
            preparationOrders: 0,
            shippedOrders: 0,
            deliveredOrders: 0,
            cancelledOrders: 0,
        };

        const validOrdersCount =
            globalStats.totalOrders - globalStats.cancelledOrders;

        const avgOrderValue =
            validOrdersCount > 0
                ? globalStats.totalRevenue / validOrdersCount
                : 0;


        // =====================================================
        // COMPARAISON AUJOURD'HUI / CE MOIS / MOIS DERNIER
        // =====================================================

        const getPeriodStats = async (start, end) => {

            const result = await Order.aggregate([
                { $match: { createdAt: { $gte: start, $lte: end } } },
                {
                    $group: {
                        _id: null,
                        revenue: {
                            $sum: {
                                $cond: [
                                    { $ne: ["$status", "ANNULEE"] },
                                    { $add: ["$totalPrice", "$deliveryFee"] },
                                    0,
                                ],
                            },
                        },
                        orders: { $sum: 1 },
                    },
                },
            ]);

            return result[0] || { revenue: 0, orders: 0 };
        };

        const [todayStats, thisMonthStats, lastMonthStats] = await Promise.all([
            getPeriodStats(startOfToday, endOfToday),
            getPeriodStats(startOfThisMonth, now),
            getPeriodStats(startOfLastMonth, endOfLastMonth),
        ]);

        const monthGrowthPercent =
            lastMonthStats.revenue > 0
                ? ((thisMonthStats.revenue - lastMonthStats.revenue) /
                      lastMonthStats.revenue) *
                  100
                : thisMonthStats.revenue > 0
                ? 100
                : 0;


        // =====================================================
        // ÉVOLUTION DU REVENU - 30 DERNIERS JOURS (line chart)
        // =====================================================

        const revenueByDay = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: last30DaysStart, $lte: endOfToday },
                    status: { $ne: "ANNULEE" },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: { $add: ["$totalPrice", "$deliveryFee"] } },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);


        // =====================================================
        // ÉVOLUTION DU REVENU - 12 DERNIERS MOIS (vue macro)
        // =====================================================

        const revenueByMonth = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: last12MonthsStart },
                    status: { $ne: "ANNULEE" },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    revenue: { $sum: { $add: ["$totalPrice", "$deliveryFee"] } },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);


        // =====================================================
        // RÉPARTITION DES COMMANDES PAR STATUT (pie chart)
        // =====================================================

        const ordersByStatus = [
            { status: "EN_PREPARATION", count: globalStats.preparationOrders },
            { status: "EXPEDIEE", count: globalStats.shippedOrders },
            { status: "LIVREE", count: globalStats.deliveredOrders },
            { status: "ANNULEE", count: globalStats.cancelledOrders },
        ];


        // =====================================================
        // TOP 10 PRODUITS LES PLUS VENDUS (par quantité)
        // =====================================================

        const topProducts = await Order.aggregate([
            { $match: { status: { $ne: "ANNULEE" } } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    quantitySold: { $sum: "$items.quantity" },
                    revenue: {
                        $sum: { $multiply: ["$items.price", "$items.quantity"] },
                    },
                },
            },
            { $sort: { quantitySold: -1 } },
            { $limit: 10 },
        ]);


        // =====================================================
        // VENTES PAR CATÉGORIE (nécessite un lookup Variant -> Clothing)
        // =====================================================

        const salesByCategory = await Order.aggregate([
            { $match: { status: { $ne: "ANNULEE" } } },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "variants",
                    localField: "items.variant",
                    foreignField: "_id",
                    as: "variantInfo",
                },
            },
            { $unwind: "$variantInfo" },
            {
                $lookup: {
                    from: "clothings",
                    localField: "variantInfo.clothing",
                    foreignField: "_id",
                    as: "clothingInfo",
                },
            },
            { $unwind: "$clothingInfo" },
            {
                $lookup: {
                    from: "categories",
                    localField: "clothingInfo.category",
                    foreignField: "_id",
                    as: "categoryInfo",
                },
            },
            { $unwind: "$categoryInfo" },
            {
                $group: {
                    _id: "$categoryInfo.name",
                    quantitySold: { $sum: "$items.quantity" },
                    revenue: {
                        $sum: { $multiply: ["$items.price", "$items.quantity"] },
                    },
                },
            },
            { $sort: { revenue: -1 } },
        ]);
        // ⚠️ Ajuste "clothings" / "variants" / "categories" si tes noms de
        // collections Mongo diffèrent (nom en minuscule + pluriel par défaut
        // via Mongoose, sauf si tu l'as override dans le schema).


        // =====================================================
        // TOP 5 WILAYAS (utile pour la logistique/livraison)
        // =====================================================

        const topWilayas = await Order.aggregate([
            { $match: { status: { $ne: "ANNULEE" } } },
            {
                $group: {
                    _id: "$wilaya",
                    orders: { $sum: 1 },
                    revenue: { $sum: { $add: ["$totalPrice", "$deliveryFee"] } },
                },
            },
            { $sort: { orders: -1 } },
            { $limit: 5 },
        ]);


        // =====================================================
        // CLIENTS : nouveaux vs récurrents (basé sur le téléphone,
        // vu qu'il n'y a pas de compte client)
        // =====================================================

        const customersAgg = await Order.aggregate([
            {
                $group: {
                    _id: "$phone",
                    ordersCount: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: null,
                    totalCustomers: { $sum: 1 },
                    returningCustomers: {
                        $sum: { $cond: [{ $gt: ["$ordersCount", 1] }, 1, 0] },
                    },
                },
            },
        ]);

        const customerStats = customersAgg[0] || {
            totalCustomers: 0,
            returningCustomers: 0,
        };


        // =====================================================
        // ALERTES STOCK (variantes en rupture ou stock faible)
        // =====================================================

        const LOW_STOCK_THRESHOLD = 5;

        const lowStockVariants = await Variant.find({
            quantity: { $lte: LOW_STOCK_THRESHOLD },
        })
            .sort({ quantity: 1 })
            .limit(15)
            .populate("clothing", "name")
            .lean();

        const outOfStockCount = await Variant.countDocuments({ quantity: 0 });
        const lowStockCount = await Variant.countDocuments({
            quantity: { $gt: 0, $lte: LOW_STOCK_THRESHOLD },
        });


        // =====================================================
        // 5 DERNIÈRES COMMANDES (aperçu rapide)
        // =====================================================

        const recentOrders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();


        // =====================================================
        // RÉPONSE
        // =====================================================

        return res.status(200).json({
            success: true,
            data: {

                kpis: {
                    totalOrders: globalStats.totalOrders,
                    totalRevenue: globalStats.totalRevenue,
                    totalProductsSold: globalStats.totalProductsSold,
                    avgOrderValue,
                    totalCustomers: customerStats.totalCustomers,
                    returningCustomers: customerStats.returningCustomers,
                    outOfStockCount,
                    lowStockCount,
                },

                comparison: {
                    today: todayStats,
                    thisMonth: thisMonthStats,
                    lastMonth: lastMonthStats,
                    monthGrowthPercent,
                },

                ordersByStatus,

                revenueByDay,
                revenueByMonth,

                topProducts,
                salesByCategory,
                topWilayas,

                lowStockVariants,
                recentOrders,
            },
        });

    } catch (err) {

        next(err);

    }
};