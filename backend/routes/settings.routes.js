import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import authorize from "../middlewares/auth.middleware.js";


const settingsRouter = new Router();

settingsRouter.get("/", getSettings);

settingsRouter.put('/', authorize, updateSettings)

export default settingsRouter;

