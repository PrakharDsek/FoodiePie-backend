import express from "express";
import singleUpload from "../Middlewares/Multer.js";
import {
  addItem,
  deleteFoodItem,
  getFoodItems,
  searchFoodItems,
  updateFoodItem,
} from "../Controllers/FoodItems.js";
import {
  addToSave,
  removeFromSave,
} from "../Controllers/AdditionalFeatures.js";

const foodItems = express.Router();

foodItems.post("/food/add", singleUpload, addItem);
foodItems.post("/food/addToCart", addToSave);
foodItems.delete("/food/remFromCart", removeFromSave);
foodItems.delete("/food/remove", deleteFoodItem);
foodItems.get("/food/get", getFoodItems);
foodItems.get("/food/search", searchFoodItems);
foodItems.put("/food/update", updateFoodItem);

export default foodItems;
