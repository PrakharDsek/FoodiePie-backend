/**
 * The above code is a JavaScript module that exports two functions, `getSellersById` and
 * `getSellerByName`, which are used to retrieve seller data from a database based on the seller's ID
 * or name respectively.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes details such as the request method, headers, query
 * parameters, and body.
 * @param res - The `res` parameter is the response object that is used to send the HTTP response back
 * to the client. It contains methods and properties that allow you to set the status code, headers,
 * and send the response body.
 */
import { Users } from "../Models/Users.js";
import { FoodItems } from "../Models/FoodItems.js";

export const getSellersById = async (req, res) => {
  try {
    const { sellerId } = req.query;
    const sellerData = await Users.findById(sellerId);

    if (sellerData && sellerData.isSeller == true) {
      res.status(200).json({
        success: true,
        message: "Got the user",
        data: sellerData,
      });
    } else if (!sellerId) {
      res.status(400).json({
        success: false,
        message: "Please provide sellerID to continue",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Didn't find any seller with the provided sellerID",
        data: sellerData,
      });
    }
  } catch (error) {
    console.log(`An error occurred at getSellersById: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getSellerByName = async (req, res) => {
  try {
    const { name } = req.query;
    const seller = await Users.find({ name: name, isSeller: true });
    if (seller) {
      res.status(200).json({
        success: true,
        message: "Got a seller",
        data: seller,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Seller with name do not exist",
      });
    }
  } catch (error) {
    console.log(`Got an error at getSellerByName: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getSellerDataBySellerId = async (req, res) => {
  const { sellerId } = req.query;
  try {
    const sellerData = await FoodItems.find({ "seller.id": sellerId });
    res.status(200).json({
      success: true,
      meessage: "Got all the items of the seller",
      data: sellerData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured while perforiming the task",
    });
    console.log(
      "An eroor occured at getSellerDataBySellerId, The complete error:",
      error.message
    );
  }
};
