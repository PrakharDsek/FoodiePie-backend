import mongoose from "mongoose";

const couponsSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    unique: true,
    require: true,
  },
  couponName: {
    type: String,
    unique: false,
    require: true,
  },
  discount: {
    type: Number,
    require: true,
  },
  credits: {
    type: [
      {
        createdAt: {
          type: Date,
          default: Date.now(),
        },
        createdBy: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
});

export const Coupons = mongoose.model("Coupons", couponsSchema);
