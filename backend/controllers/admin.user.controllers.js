import User from "../models/user.model.js";
import bcrypt from "bcrypt"



export const getUser = async(req , res, next) => {

    try{


        const user = await User.findOne();

        if(!user){
            return res.status(404).json({
                success : false,
                message : "Error user not found"
            });
        }

        const userResponse = {
            firstName : user.firstName,
            lastName : user.lastName,
            email : user.email,
            createdAt : user.createdAt,
            updatedAt : user.updatedAt
        };


        return res.status(200).json({
            success : true,
            message : "User fetched successfully",
            data : userResponse
        });

    }catch(err){
        next(err);
    }
}


export const updateUser = async(req, res, next)  => {

    try{
    
    const {firstName, lastName, email} = req.body;

    const user = await User.findOne();

    if(!user){
        return res.status(404).json({
            success : false,
            message : "Error user not found"
        });
    }

    const where = {};

    if(firstName && firstName.trim() !== ""){
        where.firstName = firstName.trim()
    }

    if(lastName && lastName.trim() !== ""){
        where.lastName = lastName.trim();
    }

    if(email && email.trim() !== ""){

         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(!email || email.trim() === "" || !emailRegex.test(email)){
                return res.status(400).json({
                    success : false,
                    message : "Error invalid email address"
                });
            }
        where.email = email.trim()
    }

    Object.assign(user, where);

    await user.save();

    return res.status(200).json({
        success : true,
        message : "user updated successfully"
    });

    }catch(err){
        next(err);
    }
}


export const updatePassword = async(req, res, next) => {

    try{

        const {oldPassword,password1, password2} = req.body;

        const user = await User.findOne();

        if(!user){
            return res.status(404).json({
                success : false,
                message : "Error user not found"
            });
        }

        const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if(!oldPassword || oldPassword.trim() === "" ){
            return res.status(400).json({
                success :false,
                message : "Erreur Ancien mot de passe invalide"
            });
        }

        const matchPassword = await bcrypt.compare( oldPassword, user.password);


        if(!matchPassword){
            return res.status(400).json({
                success : false,
                message : "Ancien mot de passe invalide"
            });
        }

        if(password1 !== password2){
            return res.status(400).json({
                success : false,
                message : "Erreur les nouveau mots de passes sont différents"
            });
        }

        if(!password1 || password1.trim() === "" || !passwordRegex.test(password1)){
            return res.status(400).json({
                success : false,
                message : "Erreur le mot de passe doit contenir au moins 8 caractéres, dont au moins une Majuscule, une minuscule, et un symbole"
            })
        }

        const salt = await bcrypt.genSalt(10);

        const newPassword = await bcrypt.hash(password1, salt);

        user.password = newPassword;

        await user.save();

        return res.status(200).json({
            success : true,
            message : "Mot de passe modifier avec succes"
        });

    }catch(err){
        next(err);
    }
}