import Category from "../models/category.model.js"



export const getCategories = async(req , res , next) => {

    try{

        const categories = await Category.find();

        return res.status(200).json({
            success: true,
            message : "Categories fetched successfully",
            data : categories
        });
    }catch(err){
       next(err);
    }
}