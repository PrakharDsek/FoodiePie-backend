import mongoose, { mongo } from "mongoose";

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    unique: true,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
  },
  address: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  phoneNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (value) {
        // Regular expression for phone number validation
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(value);
      },
      message: "Invalid phone number. Please provide a 10-digit phone number.",
    },
  },
  dishPref: {
    type: String,
    unique: false,
    require: true,
    trim: true,
    lowercase: true,
  },
  isSeller: {
    type: Boolean,
    require: true,
    default: false,
  },
  savedItems: {
    type: [
      {
        itemId: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
});
export const Users = mongoose.model("Users", usersSchema);
