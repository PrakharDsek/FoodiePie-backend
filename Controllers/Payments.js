import { Order } from "../Models/Orders.js";
import crypto from "crypto";
import { Payment } from "../Models/Payments.js";

export const verifyPayment = async (req, res) => {
  try {
    const { razorPayId, razorPayOrderId, razorPaySign } = req.body;
    const body = req.body.razorPayOrderId + "|" + req.body.razorPayId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RZPSEC)
      .update(body)
      .digest("hex");

    const isAuth = expectedSignature === razorPaySign;

    if (isAuth) {
      const payment = await Payment.create({
        razorPayId,
        razorPayOrderId,
        razorPaySign,
        payment: true,
      });

      await Order.findOneAndUpdate(
        {
          "placedBy.id": req.body.userId,
        },
        { payment: true }
      );

      await payment.save();

      res.status(200).json({
        success: true,
        message: "The recent payment is verified and created",
      });
    } else {
      res.status(200).json({
        success: false,
        message: "The recent payment is not verified and not created",
      });
    }
  } catch (error) {
    console.log(`An error occurred at verifyPayment: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Something went out",
    });
  }
};
