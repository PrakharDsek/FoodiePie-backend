import express from "express";
import {
  cancelOrders,
  createOrder,
  getOrdersById,
  getOrdersByUserId,
} from "../Controllers/Orders.js";

const orders = express.Router();

orders.get("/orders/get", getOrdersById);
orders.post("/orders/create", createOrder);
orders.delete("/orders/cancel", cancelOrders);
orders.get("/orders/getUID", getOrdersByUserId);

export default orders;
