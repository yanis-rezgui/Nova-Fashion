import Variant from "../models/variant.model.js";


export const getCartVariants = async(req , res , next) => {

    try{

        const {variantIds} = req.body;

          if (!Array.isArray(variantIds)) {
            return res.status(400).json({
                success: false,
                message: "variantIds must be an array"
            });
            }

        if (variantIds.length === 0) {
            return res.status(200).json({
                success: true,
                message: "You have no variants",
                data: []
            });
        }

        const variants = await Variant.find({
            _id : {$in : variantIds}
        });

        return res.status(200).json({
            success : true,
            message: "Variants got successfully",
            data : variants
        });
    }catch(err){
        next(err);
    }
}