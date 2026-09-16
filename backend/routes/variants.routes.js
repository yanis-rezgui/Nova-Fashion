import { Router } from "express";
import { getCartVariants } from "../controllers/variants.controller.js";


const variantsRouter = new Router();

variantsRouter.post('/', getCartVariants);

export default variantsRouter;