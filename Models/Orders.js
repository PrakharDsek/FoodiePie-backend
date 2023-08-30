import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema({
  order: {
    placedOn: {
      type: Date,
      default: Date.now,
    },
    recivedBy: Date,
    total: Number,
  },
  placedBy: {
    name: String,
    Uid: mongoose.Schema.Types.ObjectId,
  },
  orderedItems: [
    {
      items: Array,
      sellerId: Array,
    },
  ],
  orderPayments: {
    type: Array,
  },
  payment: {
    type: Boolean,
    default: false,
  },
});

export const Order = mongoose.model("Orders", ordersSchema);
