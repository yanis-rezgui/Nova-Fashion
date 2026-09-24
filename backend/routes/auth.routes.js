import { Router } from "express";
import { signIn, signOut } from "../controllers/auth.controller.js";
import { authLimiter } from "../middlewares/rateLimiter.js";



const authRouter = new Router();

//authRouter.post('/sign-up', signUp);

authRouter.post('/sign-in', authLimiter, signIn);

authRouter.post('/sign-out', signOut);

export default authRouter;