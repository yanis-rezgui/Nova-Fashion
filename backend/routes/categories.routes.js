import { Router } from "express";
import { getCategories } from "../controllers/categories.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import { createCategory, deleteCategory, updateCategory } from "../controllers/admin.categories.controller.js";
import multer from "multer";


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
const categoriesRouter = new Router();

categoriesRouter.get('/', getCategories);

categoriesRouter.post('/', authorize, upload.single("image"), createCategory);

categoriesRouter.put('/:id', authorize, upload.single("image"), updateCategory);

categoriesRouter.delete('/:id', authorize, deleteCategory);

export default categoriesRouter;