import {Router} from "express"
import authorize from "../middlewares/auth.middleware.js";
import { getUser, updatePassword, updateUser } from "../controllers/admin.user.controllers.js";


const userRouter = new Router();

userRouter.get('/', authorize, getUser);

userRouter.put('/', authorize, updateUser);

userRouter.put('/password', authorize, updatePassword);


export default userRouter;