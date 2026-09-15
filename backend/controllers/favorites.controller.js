import Clothing from "../models/clothing.model.js";



export const getFavorites = async (req, res, next) => {
    try {

        const { favoriteIds } = req.body;

        if (!Array.isArray(favoriteIds)) {
            return res.status(400).json({
                success: false,
                message: "favoriteIds must be an array"
            });
        }

        if (favoriteIds.length === 0) {
            return res.status(200).json({
                success: true,
                message: "You have no favorites",
                data: []
            });
        }

        const favorites = await Clothing.find({
            _id: { $in: favoriteIds }
        })
        .populate("category")
        .lean();

        return res.status(200).json({
            success: true,
            data: favorites
        });

    } catch (err) {
        next(err);
    }
};