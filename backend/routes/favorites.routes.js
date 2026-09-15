import { Router } from "express";
import { getFavorites } from "../controllers/favorites.controller.js";


const favoritesRouter = new Router();

favoritesRouter.post('/', getFavorites);

export default favoritesRouter;