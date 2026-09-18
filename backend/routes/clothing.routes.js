import { Router } from "express";
import multer from "multer";

import { getCloth, getClothes } from "../controllers/clothing.controller.js";
import {
  createClothing,
  updateClothing,
  deleteClothing,
} from "../controllers/clothingAdmin.controller.js";
import {
  addVariant,
  updateVariant,
  deleteVariant,
} from "../controllers/variant.admin.controller.js";

import authorize from "../middlewares/auth.middleware.js";
import { getClothesAdmin } from "../controllers/clothing.admin.controller.js";
// Recommandé : un middleware pour restreindre l'accès aux admins
// import requireAdmin from "../middlewares/admin.middleware.js"; 

const clothingRouter = Router();

// Configuration Multer
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

// =====================================================
// Routes Publiques
// =====================================================
clothingRouter.get("/", getClothes);

clothingRouter.get("/admin", authorize, getClothesAdmin);
clothingRouter.get("/:id", getCloth);

// =====================================================
// Routes Admin - Vêtements
// =====================================================

clothingRouter.post("/", authorize, upload.array("images"), createClothing);
clothingRouter.put("/:id", authorize, upload.array("images"), updateClothing);
clothingRouter.delete("/:id", authorize, deleteClothing);



export default clothingRouter;