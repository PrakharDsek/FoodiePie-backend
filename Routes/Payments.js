import express from "express";
import { verifyPayment } from "../Controllers/Payments.js";

const payments = express.Router();

payments.post("/payments/verify",verifyPayment);

export default payments;
