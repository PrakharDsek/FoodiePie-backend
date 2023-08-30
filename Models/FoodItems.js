import mongoose from "mongoose";

const foodItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: true,
  },
  seller: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  smallDesc: {
    type: String,
    unique: false,
    required: true,
    validate: {
      validator: function (value) {
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount === 4;
      },
      message: "Small description should contain exactly 4 words.",
    },
  },
  description: {
    type: String,
    required: true,
  },
  offers: {
    type: [
      {
        offerTag: String,
        discount: Number,
      },
    ],
  },
  images: {
    type: [
      {
        imageURL: String,
        publicId: String,
      },
    ],
  },
  price: {
    type: Number,
    default:0,
  
  },
  stock: {
    type: [
      {
        sold: Number,
        available: Number,
      },
    ],
  },
  rating: {
    type: Number,
    default: 3,
  },
});

export const FoodItems = mongoose.model("FoodItem", foodItemsSchema);
