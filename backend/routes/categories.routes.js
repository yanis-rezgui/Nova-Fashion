import { Router } from "express";
import { getCategories } from "../controllers/categories.controller.js";


const categoriesRouter = new Router();

categoriesRouter.get('/', getCategories);

export default categoriesRouter;