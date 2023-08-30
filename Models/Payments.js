import mongoose from "mongoose";

const paymentsSchema = new mongoose.Schema({
  razorpay_payment_id: {
    type: String,
  },
  razorpay_order_id: {
    type: String,
  },
  razorpay_signature: {
    type: String,
  },
  payment: {
    type: Boolean,
    require: true,
  },
});

export const Payment = mongoose.model("Payments", paymentsSchema);
