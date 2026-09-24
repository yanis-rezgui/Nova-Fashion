import rateLimit from "express-rate-limit";

// Limite générale sur toute l'API
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Trop de requêtes, réessayez plus tard" },
});

// Limite stricte sur le login (anti brute-force)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true,
    message: { success: false, message: "Trop de tentatives de connexion, réessayez plus tard" },
});