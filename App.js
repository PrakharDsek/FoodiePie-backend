import express from "express";
import users from "./Routes/Users.js";
import coupons from "./Routes/Coupons.js";
import orders from "./Routes/Orders.js";
import foodItems from "./Routes/FoodItems.js";
import payments from "./Routes/Payments.js";
import cookieParser from "cookie-parser";
import sellers from "./Routes/Seller.js";
import dotenv from "dotenv";

dotenv.config({ path: "./Config/.env" });

import cors from "cors";

const App = express();
App.use(cookieParser());
App.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
console.log(process.env.FRONTEND_URL);
App.use(express.json());
App.use("/api/v1", users);
App.use("/api/v1", coupons);
App.use("/api/v1", orders);
App.use("/api/v1", foodItems);
App.use("/api/v1", payments);
App.use("/api/v1", sellers);

export default App;
