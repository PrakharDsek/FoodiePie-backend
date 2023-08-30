/**
 * The above code is a JavaScript module that contains functions for adding food items, getting food
 * items based on category, and searching for food items.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes details such as the request headers, request body, request
 * method, request URL, and query parameters.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, sending JSON data, or redirecting the client to another URL.
 */
import { query } from "express";
import { FoodItems } from "../Models/FoodItems.js";
import getDataURI from "../Utils/dataParser.js";
import cloudinary from "cloudinary";
import { Users } from "../Models/Users.js";

export const addItem = async (req, res) => {
  try {
    const {
      name,
      sellerId,
      sellerName,
      smallDesc,
      description,
      offers, // Assuming offers is an array of objects
      price,
      stock,
      type,
    } = req.body;

    const file = req.file;
    const fileUri = getDataURI(file);
    console.log(offers);

    const checkUser = await Users.findById(sellerId);

    if (checkUser && checkUser.isSeller) {
      const cloud = await cloudinary.v2.uploader.upload(fileUri.content);

      const parsedPrice = parseFloat(price);
      const parsedStock = parseInt(stock);

      await FoodItems.create({
        name,
        seller: {
          id: sellerId,
          name: sellerName,
        },
        images: [
          {
            publicId: cloud.public_id,
            imageURL: cloud.secure_url,
          },
        ],
        smallDesc,
        description,
        offers: [offers], // Assign the formatted offers array
        price: parsedPrice,
        "stock.available": parsedStock,
        type,
      });

      return res.status(200).json({
        success: true,
        message: "Successfully created food item",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Sorry, you need to register as a seller to add food items.",
      });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error: Please check your input data.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: `Something went wrong: ${error.message}`,
      });
    }
  }
};
export const getFoodItems = async (req, res) => {
  try {
    const { category } = req.query;
    const responseSender = (resCode, resMessage, data, operation) => {
      res.status(resCode).json({
        success: operation,
        message: resMessage,
        data: data ? data : [],
      });
    };
    if (category == "home") {
      const itemsHome = await FoodItems.find({ rating: { $gt: 4 } });
      responseSender(200, "Got all the home items", itemsHome, true);
    } else if (category == "best") {
      const itemsBest = await FoodItems.find({ rating: { $gt: 3 } });
      responseSender(200, "Got all the best", itemsBest, true);
    } else if (category == "offers") {
      const itemsOffers = await FoodItems.find({
        offers: { $elemMatch: {} },
      });

      responseSender(200, "Got all the offers items", itemsOffers, true);
    } else if (category == "allSeller") {
      const { sellerId } = req.query;
      const itemsOffer = await FoodItems.find({ "seller.name": sellerId });
      responseSender(200, "Got all the offers items", itemsOffer, true);
    } else if (category == "byId") {
      const { id } = req.query;
      const itemsOffer = await FoodItems.findById(id);
      responseSender(200, "Got all the offers items", itemsOffer, true);
    } else {
      responseSender(404, "did'nt found an category", "", false);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Something went wrong: ${error.message}`,
    });
    console.log("An error occured at getFoodItems :", error.message);
  }
};

export const searchFoodItems = async (req, res) => {
  try {
    const { query } = req.query;
    const searchRegex = new RegExp(query, "i");

    const searchData = await FoodItems.find({ name: searchRegex }).limit(10);

    if (searchData.length > 0) {
      res.status(200).json({
        success: true,
        message: `Search Results for ${query}`,
        data: searchData,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No products found",
      });
    }
  } catch (error) {
    console.log(`An error occurred at search food item: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const updateFoodItem = async (req, res) => {
  try {
    const { id, newData } = req.body;
    const data = await FoodItems.findByIdAndUpdate(id, {
      name: newData.name,
      smallDesc: newData.smallDesc,
      description: newData.description,
      discount: newData.discount,
      price: newData.price,
      stock: newData.stock,
      type: newData.type,
      offers: newData.offers,
    });
    if (data) {
      res.status(200).json({
        success: true,
        message: "Upedated product successfully",
        data: data,
      });
    }
    console.log(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error :${error.message}`,
    });
  }
};

export const deleteFoodItem = async (req, res) => {
  const { foodItemId } = req.query;
  try {
    const data = await FoodItems.findByIdAndDelete(foodItemId);
    if (data) {
      res.status(200).json({
        success: true,
        message: "Delted the item successFully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid id provided",
        data: data,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error :${error.message}`,
    });
  }
};
