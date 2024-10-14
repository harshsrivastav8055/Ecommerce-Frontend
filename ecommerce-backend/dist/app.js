import express from 'express';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
import NodeCache from 'node-cache';
import { config } from "dotenv";
import morgan from "morgan";
import { Stripe } from 'stripe';
import cors from "cors";
const app = express();
//Importing Routes
import userRoute from './routes/user.js';
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import paymentRoute from './routes/payment.js';
import dashboardRoute from "./routes/stats.js";
config({
    path: "./.env",
});
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";
connectDB(mongoURI);
// export const redis = connectRedis('127.0.0.1:6379');
export const myCache = new NodeCache();
export const stripe = new Stripe(stripeKey);
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
// Using Routes
app.get("/", (req, res) => {
    res.send("API Working with /api/v1");
});
app.use('/api/v1/user', userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});
// utils me baar use use hone wale functions hote hai
