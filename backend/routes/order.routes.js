import { Router } from "express";
import { placeOrder } from "../controllers/order.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import { deleteOrder, getAllOrders, updateOrderStatus } from "../controllers/admin.orders.controller.js";

const orderRouter = new Router();

orderRouter.post('/', placeOrder);

orderRouter.get('/', authorize, getAllOrders);

orderRouter.put('/:id', authorize, updateOrderStatus)

orderRouter.delete('/:id', authorize, deleteOrder);

export default orderRouter;

