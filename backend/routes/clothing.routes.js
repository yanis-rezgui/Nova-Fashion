import { Router } from "express";
import { getCloth, getClothes } from "../controllers/clothing.controller.js";




const clothingRouter = new Router();

clothingRouter.get('/', getClothes);

clothingRouter.get('/:id', getCloth);


export default clothingRouter;