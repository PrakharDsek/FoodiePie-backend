import express from "express";
import {
  createCoupons,
  checkAndApplyCoupons,
  getAllCoupons,
  editCoupons,
  deleteCoupons,
} from "../Controllers/Coupons.js";

const coupons = express.Router();

coupons.post("/coupons/new", createCoupons);
coupons.post("/coupons/apply", checkAndApplyCoupons);
coupons.get("/coupons/all", getAllCoupons);
coupons.put("/coupons/update", editCoupons);
coupons.delete("/coupons/delete", deleteCoupons);

export default coupons;
