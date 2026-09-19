import Notification from "../models/notification.model.js";


export const getAllNotifications = async (req, res, next) => {

    try {

        const {
            read,
            page = 1,
            limit = 10,
        } = req.query;

        const filter = {};

        // Filtre read=true / read=false
        if (read === "true" || read === "false") {
            filter.read = read === "true";
        }

        const currentPage = Math.max(Number(page) || 1, 1);

        const pageLimit = Math.min(
            Math.max(Number(limit) || 10, 1),
            50
        );

        const skip = (currentPage - 1) * pageLimit;


        const [allNotifications, total] = await Promise.all([

            Notification.find(filter)
                .sort({
                    createdAt: -1,
                    _id: -1,
                })
                .skip(skip)
                .limit(pageLimit)
                .lean(),

            Notification.countDocuments(filter),

        ]);


        return res.status(200).json({
            success: true,
            message: "Notifications récupérées avec succès",
            data: allNotifications,

            pagination: {
                page: currentPage,
                limit: pageLimit,
                total,
                totalPages: Math.ceil(total / pageLimit),
            },
        });

    } catch (err) {

        next(err);

    }
};


export const markAsRead = async (req, res, next) => {

    try {

        const notificationId = req.params.id;

        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            {
                read: true,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!notification) {

            return res.status(404).json({
                success: false,
                message: "Notification introuvable",
            });

        }

        return res.status(200).json({
            success: true,
            message: "Notification marquée comme lue",
            data: notification,
        });

    } catch (err) {

        next(err);

    }
};


export const markAllAsRead = async (req, res, next) => {

    try {

        const result = await Notification.updateMany(
            {
                read: false,
            },
            {
                $set: {
                    read: true,
                },
            }
        );


        return res.status(200).json({
            success: true,
            message: "Toutes les notifications ont été marquées comme lues",
            data: {
                updatedCount: result.modifiedCount,
            },
        });

    } catch (err) {

        next(err);

    }
};


export const getNotificationsStats = async (req, res, next) => {

    try {

        const [
            totalNotifications,
            unreadNotifications,
            readNotifications,
        ] = await Promise.all([

            Notification.countDocuments(),

            Notification.countDocuments({
                read: false,
            }),

            Notification.countDocuments({
                read: true,
            }),

        ]);


        return res.status(200).json({
            success: true,
            message: "Statistiques des notifications récupérées avec succès",
            data: {
                total: totalNotifications,
                unread: unreadNotifications,
                read: readNotifications,
            },
        });

    } catch (err) {

        next(err);

    }
};