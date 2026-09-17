import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import prisma from "../config/prisma.js";

const authorize = async (req, res, next) => {
    try {
        let token;

        // Récupérer le token depuis Authorization: Bearer <token>
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Error - No token provided",
            });
        }

        // Vérifier le token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Vérifier que le token contient bien l'id utilisateur
        if (!decoded.userId) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token",
            });
        }

        // Récupérer l'utilisateur avec Prisma
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
        });

        if (!user) { 
            return res.status(401).json({
                message: "Unauthorized - User not found",
            });
        }

        // Ajouter l'utilisateur à la requête
        req.user = user;

        next();

    } catch (err) {
        console.error(err);

        return res.status(401).json({
            message: "Unauthorized - Invalid token",
            error: err.message,
        });
    }
};

export default authorize;