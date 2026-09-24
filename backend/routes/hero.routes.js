import { Router } from "express";
import multer from "multer";

import { getHero, createHero, updateHero } from "../controllers/hero.controller.js";
import authorize from "../middlewares/auth.middleware.js";

// Configuration Multer (même pattern que categories/clothing)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "image/avif",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, AVIF, and WEBP are allowed."));
    }
  },
});

// slideImages : plusieurs fichiers (au moins 3) ; featuredProductImages : exactement 2
const heroUpload = upload.fields([
  { name: "slideImages", maxCount: 10 },
  { name: "featuredProductImages", maxCount: 2 },
]);

const heroRouter = Router();

// =====================================================
// Route Publique
// =====================================================
heroRouter.get("/", getHero);

// =====================================================
// Routes Admin
// =====================================================
heroRouter.post("/", authorize, heroUpload, createHero);
heroRouter.put("/", authorize, heroUpload, updateHero);

export default heroRouter;