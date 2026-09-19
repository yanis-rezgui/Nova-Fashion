import express, { urlencoded } from "express"
import helmet from "helmet";
import errorMiddleware from "./middlewares/error.middleware.js";
import connectToDatabase from "./database/mongodb.js";
import { PORT } from "./config/env.js";
import cors from "cors"
import {  seedSettings } from "./database/insertData.js";
import clothingRouter from "./routes/clothing.routes.js";
import categoriesRouter from "./routes/categories.routes.js";
import favoritesRouter from "./routes/favorites.routes.js";
import variantsRouter from "./routes/variants.routes.js";
import orderRouter from "./routes/order.routes.js";
import authRouter from "./routes/auth.routes.js";
import testimonialRouter from "./routes/testimonial.routes.js";
import settingsRouter from "./routes/settings.routes.js";
import userRouter from "./routes/user.router.js";
import {createServer} from "http"
import { initializeSocket } from "./socket/socket.js";
import notificationsRouter from "./routes/notifications.routes.js";


const app = express(); 

const server = createServer(app);

initializeSocket(server);

app.use(helmet());

app.use(cors({
    origin : [
        "http://localhost:5173",
    ],
    credentials : true
}));

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use('/api/v1/clothing', clothingRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/favorites', favoritesRouter);
app.use('/api/v1/variants', variantsRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/testimonials', testimonialRouter);
app.use('/api/v1/settings', settingsRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/notifications', notificationsRouter);

app.use(errorMiddleware);

const startServer = async() => {

    try{

        console.log("Trying connecting to database : ");
        await connectToDatabase();
       // await seedSettings();
        server.listen(PORT, ()=>{
           console.log(`App running on : http://localhost:${PORT}`);
        });
    }catch(err){
        console.error(err);
    }
}

startServer();