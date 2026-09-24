import { Router } from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import authorize from "../middlewares/auth.middleware.js";
// ⚠️ Adapte le chemin/noms des middlewares à ceux que tu utilises déjà
// pour protéger tes routes admin (ex: dans orders.routes.js ou clothing.routes.js).

const dashboardRouter = Router();

dashboardRouter.get("/", authorize, getDashboardData);

export default dashboardRouter;