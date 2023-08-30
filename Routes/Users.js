import express from "express";
import {
  createUser,
  getUserById,
  getUserByMail,
  loginUser,
  updateUserCredentials,
} from "../Controllers/Users.js";
import isAuthenticated from "../Middlewares/isAuthenticated..js";

const users = express.Router();

users.post("/user/accounts/new", createUser);
users.post("/user/accounts/login", loginUser);
users.get("/user/find", getUserByMail);
users.get("/user/findId", isAuthenticated, getUserById);
users.put("/user/update", updateUserCredentials);
export default users;