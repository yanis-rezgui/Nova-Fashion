import mongoose from "mongoose";
import Testimonial from "../models/testimonial.model.js"



export const getActiveTestimonials = async(req, res, next) => {

    try{
    const testimonials = await Testimonial.find({
        active : true
     }).sort({createdAt : -1});

    return res.status(200).json({
        success : true,
        message : "Testimonials got successfully",
        data : testimonials
    });

   }catch(err){
    next(err);
   }
}


export const getAllTestimonials = async(req, res, next) => {

    try{

        const testimonials = await Testimonial.find();

        const activeTestimonials = testimonials.filter((t)=>t.active === true);
        const inactiveTestimonials = testimonials.filter((t)=>t.active === false);

        return res.status(200).json({
            success : true,
            message : "Testimonials got successfully",
            data: {
                testimonials,
                activeTestimonials,
                inactiveTestimonials
            }
        });
    }catch(err){
        next(err);
    }
}


export const addTestimonial = async(req, res, next) => {

    try{

        const {fullName, message, rating, active} = req.body;

        if(!fullName || fullName.trim() === ""){
            return res.status(400).json({
                success : false,
                message : "Error full name is required"
            });
        }

        if(!message || message.trim() === ""){
            return res.status(400).json({
                success : false,
                message: "Error message is required"
            });
        }

        const numericRating = Number(rating);

        if(Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5){
            return res.status(400).json({
                success : false,
                message: "Error rating must be a valid number between 1 and 5"
            });
        }

        const data = {
            fullName,
            message,
            rating : numericRating
        }

      if (typeof active === "boolean") {
    data.active = active;
}

        const newTestimonial = await Testimonial.create(data);


        return res.status(201).json({
            success : true,
            message : "Testimonial created successfully",
            data : newTestimonial
        });
    }catch(err){
        next(err);
    }
}


export const updateTestimonial = async(req, res, next) => {

    try{

        const testimonialId = req.params.id;

         if (!mongoose.Types.ObjectId.isValid(testimonialId)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid Testimonial ID"
                    });
                }

        const testimonial = await Testimonial.findById(testimonialId);

        if(!testimonial){
            return res.status(404).json({
                success: false,
                message : "Error testimonial not found"
            });
        }

        const {fullName, message, rating, active} = req.body;

        const updates = {};

        if(fullName !== undefined){
            if(!fullName || fullName.trim() === ""){
                return res.status(400).json({
                    success : false,
                    message : "Error invalid full name"
                });
            }

            updates.fullName = fullName.trim();
        }

        if(message !== undefined){
            if(!message || message.trim() === ""){
            return res.status(400).json({
                success : false,
                message: "Error message is required"
            });
           }

           updates.message = message.trim();
        }

        if(rating !== undefined){
              const numericRating = Number(rating);

        if(Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5){
            return res.status(400).json({
                success : false,
                message: "Error rating must be a valid number between 1 and 5"
            });
        }

          updates.rating = numericRating;
        }

        if(active !== undefined){
             if (typeof active !== "boolean") {
                   return res.status(400).json({
                    success : false,
                    message : "Error invalid status"
                   });
                }

            updates.active = active;
        }

        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            testimonialId,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success : true,
            message : "Testimonial updated successfully",
            data: updateTestimonial
        });
    }catch(err){
        next(err);
    }
}


export const deleteTestimonial = async(req, res,next) => {

    try{

         const testimonialId = req.params.id;

         if (!mongoose.Types.ObjectId.isValid(testimonialId)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid Testimonial ID"
                    });
                }

        const testimonial = await Testimonial.findById(testimonialId);

        if(!testimonial){
            return res.status(404).json({
                success : false,
                message : "Error testimonial not found"
            });
        }

        await Testimonial.findByIdAndDelete(testimonialId);

        return res.status(200).json({
            success : true,
            message : "Testimonial deleted successfully"
        });

    }catch(err){
        next(err);
    }
}