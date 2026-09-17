import { Router } from "express";
import { getCartVariants } from "../controllers/variants.controller.js";
import { addVariant, deleteVariant, updateVariant } from "../controllers/variant.admin.controller.js";
import authorize from "../middlewares/auth.middleware.js";


const variantsRouter = new Router();

variantsRouter.post('/', getCartVariants);

variantsRouter.post("/add", authorize, addVariant);
variantsRouter.put("/:id", authorize, updateVariant);
variantsRouter.delete("/:id", authorize, deleteVariant);

export default variantsRouter;