import express, { urlencoded } from "express"
import helmet from "helmet";
import errorMiddleware from "./middlewares/error.middleware.js";
import connectToDatabase from "./database/mongodb.js";
import { PORT } from "./config/env.js";
import cors from "cors"
import { seedClothing } from "./database/insertData.js";
import clothingRouter from "./routes/clothing.routes.js";
import categoriesRouter from "./routes/categories.routes.js";
import favoritesRouter from "./routes/favorites.routes.js";


const app = express();

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

app.use(errorMiddleware);

const startServer = async() => {

    try{

        console.log("Trying connecting to database : ");
        await connectToDatabase();
        //await seedClothing();
        app.listen(PORT, ()=>{
           console.log(`App running on : http://localhost:${PORT}`);
        });
    }catch(err){
        console.error(err);
    }
}

startServer();