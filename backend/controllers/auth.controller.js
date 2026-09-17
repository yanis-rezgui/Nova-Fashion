import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";


/*
export const signUp = async( req , res , next) => {

    try{

        const {firstName, lastName, email, password} = req.body;

        if(!firstName || firstName.trim() === ""){
            return res.status(400).json({
                success : false,
                message : "Error invalid firstName",
            });
        }

        if(!lastName || lastName.trim() === ""){
            return res.status(400).json({
                success : false,
                message : "Error invalid lastName",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!email || email.trim() ==="" || !emailRegex.test(email)){
            return res.status(400).json({
                success : false,
                message : "Error email not in correct format"
            });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if(!password || password.trim() === "" || !passwordRegex.test(password)){
            return res.status(400).json({
                success : false,
                message : "Error invalid password"
            });
        }

        const existingUser = await User.findOne({email}).select("+password");

        if(existingUser){
            return res.status(409).json({
                success : false,
                message : "Email already registered"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password : hashedPassword
        });


        const token = jwt.sign({userId : newUser._id}, JWT_SECRET, {expiresIn : JWT_EXPIRES_IN});

        const userResponse = {
            _id: newUser._id,
            firstName : newUser.firstName,
            lastName : newUser.lastName,
            email : newUser.email
        }

        return res.status(201).json({
            success : true,
            message : "User signed up successfully"
        });

    }catch(err){
        next(err);
    }
}


*/
export const signIn = async(req , res , next) => {

    try{

        const {email, password} = req.body;

       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!email || email.trim() === "" || !emailRegex.test(email)){
            return res.status(400).json({
                success : false,
                message : "Error invalid email address"
            });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if(!password || password.trim() === "" || !passwordRegex.test(password)){
            return res.status(400).json({
                success : false,
                message : "Error invalid password format"
            });
        }

        const existingUser = await User.findOne({email}).select("+password");

        if(!existingUser){
            return res.status(404).json({
                success : false,
                message : "Error user not found"
            });
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password);

        if(!isValidPassword){
            return res.status(401).json({
                success : false,
                message : "Error invalid credentials"
            });
        }

        const token = jwt.sign({userId : existingUser._id}, JWT_SECRET, {expiresIn : JWT_EXPIRES_IN});

        const userResponse = {
            _id : existingUser._id,
            firstName : existingUser.firstName,
            lastName : existingUser.lastName,
            email : existingUser.email,
        };

        return res.status(200).json({
            success: true,
            message : "User signed in successfully",
            data: {
                token,
                user : userResponse
            }
        });
    }catch(err){
        next(err)
    }
}

export const signOut = async(req , res , next) => {
    try{

        return res.status(200).json({
            success : true,
            message: "User signed out successfully"
        });
    }catch(err){
        next(err);
    }
}