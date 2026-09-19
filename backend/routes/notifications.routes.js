import authorize from "../middlewares/auth.middleware.js";
import { getAllNotifications, getNotificationsStats, markAllAsRead, markAsRead } from "../controllers/notifications.controller.js";
import { Router } from "express";



const notificationsRouter = new Router();

notificationsRouter.get('/', authorize, getAllNotifications);

notificationsRouter.put('/', authorize, markAllAsRead);

notificationsRouter.put('/:id', authorize, markAsRead);

notificationsRouter.get('/stats', authorize, getNotificationsStats);


export default notificationsRouter;