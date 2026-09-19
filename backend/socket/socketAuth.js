import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

const socketAuth = async (socket, next) => {

    try {

        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Unauthorized"));
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return next(new Error("Unauthorized"));
        }

        socket.user = user;

        next();

    } catch (error) {

        console.error("Socket authentication error:", error);

        next(new Error("Unauthorized"));
    }
};

export default socketAuth;