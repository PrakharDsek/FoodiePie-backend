/**
 * The code above is a JavaScript module that contains functions for creating a user, logging in a
 * user, and retrieving user information by email or ID.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes details such as the request headers, request body, request
 * method, and request URL.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, sending JSON data, setting cookies, etc.
 */
import { Users } from "../Models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const { name, password, email, address, phoneNo, pref ,isSeller} = req.body;
    //Check if user exists with an email or password provided
    const data = await Users.find({ email, password });

    if (!data) {
      res.status(409).json({
        success: false,
        message: "A user already exists with the same credentials",
        data: data,
      });
    } else {
      // If no user found with the credentials then encrypt the pass and create account
      const encryptedPass = await bcrypt.hash(password, 10);
      const newAcc = await Users.create({
        name,
        password: encryptedPass,
        email,
        address,
        phoneNo,
        pref,
      });
      // After the creation of an account the cookie must be setted with a signed token
      const genToken = await jwt.sign(email, process.env.JWTSEC);

      res
        .cookie("token", email, { maxAge: 24 * 24 * 24 * 300, path: "/" })
        .status(200)
        .json({
          success: true,
          message: "user is logged in",
          data: newAcc,
        });
    }
  } catch (error) {
    res.status(409).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Searching for user with email
    const user = await Users.findOne({ email });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "wrong credentials provided",
      });
    } else {
      // If got the user then compare the password
      const compare = await bcrypt.compare(password, user.password);
      if (!compare) {
        res.status(400).json({
          success: false,
          message: "wrong credentials provided",
        });
      } else {
        // If comparision is true then login the user and set cookie
        const genToken = await jwt.sign(email, process.env.JWTSEC);

        res
          .cookie("token", email, { maxAge: 24 * 24 * 24 * 300, path: "/" })
          .status(200)
          .json({
            success: true,
            message: "user is logged in",
            data: user,
          });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `something went wrong : ${error.message}`,
    });
  }
};

export const getUserByMail = async (req, res) => {
  try {
    const { mail } = req.query;
    const user = await Users.findOne({ email: mail });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "No account found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Got an account",
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Something went wrong: ${error.message}`,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await Users.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "No account found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Got an account",
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Something went wrong: ${error.message}`,
    });
  }
};
export const updateUserCredentials = async (req, res) => {
  const { update, id } = req.body;

  try {
    const updateResult = await Users.findByIdAndUpdate(id ,update);
  
    if (updateResult ) {
      res.status(200).json({
        success: true,
        message: "Update user's credentials",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User not found or no changes made",
      });
    }
  } catch (error) {
    console.log(`An error occurred at updateUserCredentials: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
