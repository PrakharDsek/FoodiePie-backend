import express from "express";
import { getSellerByName, getSellerDataBySellerId, getSellersById } from "../Controllers/Seller.js";

const sellers = express.Router();

sellers.get("/seller/getByID", getSellersById);
sellers.get("/seller/getByName", getSellerByName);
sellers.get("/seller/getAllItems", getSellerDataBySellerId);

export default sellers;
