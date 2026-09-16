import { Router } from "express";
import { placeOrder } from "../controllers/order.controller.js";


const orderRouter = new Router();

orderRouter.post('/', placeOrder);

export default orderRouter;