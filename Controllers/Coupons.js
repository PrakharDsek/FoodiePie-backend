/**
 * The below JavaScript code defines functions for creating, checking and applying, getting all,
 * editing, and deleting coupons in a coupon system.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes details such as the request headers, request body, request
 * method, and request URL.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, sending JSON data, or redirecting the client to another URL.
 */
/**
 * This JavaScript function creates a coupon by saving the coupon details to a database and returns a
 * response indicating the success or failure of the operation.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes details such as the request headers, request body, request
 * method, and request URL.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, sending JSON data, or redirecting the client to another URL.
 */
import { Coupons } from "../Models/Coupons.js";
import { nanoid } from "nanoid";

export const createCoupons = async (req, res) => {
  try {
    const { couponName, createdBy, discount } = req.body;
    const couponCode = nanoid(10);

    const generateCoupon = await Coupons.create({
      couponCode,
      couponName,
      discount,
      credits: {
        createdBy: createdBy,
      },
    });
    if (generateCoupon) {
      res.status(200).json({
        success: true,
        message: "Successfully ceated a coupon",
        data: generateCoupon,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Coupon generation failed seems you missed a field to fill",
      });
    }
  } catch (error) {
    console.log(`An error occured at createCoupon: ${error.message}`);
    res.status(500).json({
      success: false,
      message: `Something went wrong`,
    });
  }
};

/**
 * The function `checkAndApplyCoupons` checks if a coupon code is valid and applies it to the total sub
 * amount if it is.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made to the server. It includes details such as the request headers, request body, request
 * method, and request URL.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, sending JSON data, or redirecting the client to another URL.
 */

export const checkAndApplyCoupons = async (req, res) => {
  try {
    const { couponCode, totalSubAmount } = req.body;
    if (!couponCode || !totalSubAmount) {
      res.status(400).json({
        success: false,
        messsage: "Please fill all the details",
      });
    } else {
      const checkCoupon = await Coupons.find({ couponCode: couponCode });

      if (checkCoupon.length > 0) {
        const finalSubAmount =
          totalSubAmount -
          totalSubAmount * (checkCoupon.map((coupon) => coupon.discount) / 100);
        res.status(200).json({
          success: true,
          message: "The coupon code is valid and is applied",
          discount: checkCoupon.map((coupon) => coupon.discount),
          data: finalSubAmount,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "The coupon code is not valid",
        });
      }
    }
  } catch (error) {
    console.log(`An error occured at checkAndApplyCoupon: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const allCoupons = await Coupons.find({});
    if (allCoupons.length > 0) {
      res.status(200).json({
        success: true, // Set success to true since the operation was successful
        message: "Got all the coupons",
        data: allCoupons,
      });
    } else {
      res.status(200).json({
        success: true, // Set success to true even when no coupons are found
        message: "No coupons found",
        data: [],
      });
    }
  } catch (error) {
    console.log(`An error occurred at getAllCoupons: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const editCoupons = async (req, res) => {
  try {
    const { couponId } = req.body;
    if (req.body.name && req.body.discount) {
      const update = await Coupons.updateOne(
        { _id: couponId },
        {
          couponName: req.body.name,
          discount: req.body.discount,
        }
      );
      res.status(200).json({
        success: true,
        message: "Updated the coupon",
        data: update,
      });
    } else if (req.body.name) {
      const update = await Coupons.updateOne(
        { _id: couponId },
        {
          couponName: req.body.name,
        }
      );
      await Coupons.save;
      res.status(200).json({
        success: true,
        message: "Updated the coupon",
        data: update,
      });
    } else if (req.body.discount) {
      const update = await Coupons.updateOne(
        { _id: couponId },
        {
          discount: req.body.discount,
        }
      );
      res.status(200).json({
        success: true,
        message: "Updated the coupon",
        data: update,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Please provide discount ,name or both to update",
      });
    }
  } catch (error) {
    console.log(`An error occured at editCoupons: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const deleteCoupons = async (req, res) => {
  try {
    const { couponId } = req.query;
    const deleteCoupon = await Coupons.deleteOne({ _id: couponId });
    if (deleteCoupon) {
      res.status(200).json({
        success: true,
        message: "Deleted the coupon",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No coupon found with that id",
      });
    }
  } catch (error) {
    console.log(`An error occured at deleteCoupon: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
