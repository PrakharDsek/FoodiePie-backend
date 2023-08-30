import App from "./App.js";
import dotenv from "dotenv";
import { getDate } from "./Middlewares/GetDate.js";
import Database from "./Config/Database.js";
import cloudinary from "cloudinary";
import Razorpay from "razorpay";
dotenv.config({ path: "./Config/.env" });

Database();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SEC,
});

export const instance = new Razorpay({
  key_id: process.env.RZPID,
  key_secret: process.env.RZPSEC,
});

App.listen(process.env.PORT, () => {
  console.log("Server started at", getDate(), "on port", process.env.PORT);
});
