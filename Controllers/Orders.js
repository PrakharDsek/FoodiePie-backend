/**
 * The above code is a JavaScript module that contains functions for creating orders, retrieving orders
 * by ID or user ID, and canceling orders.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made to the server. It includes details such as the request headers, request body, request
 * method, request URL, and query parameters.
 * @param res - The `res` parameter is the response object that is used to send the HTTP response back
 * to the client. It contains methods and properties that allow you to set the status code, headers,
 * and send the response body.
 */
import { FoodItems } from "../Models/FoodItems.js";
import { Order } from "../Models/Orders.js";
import { Users } from "../Models/Users.js";
import { instance } from "../index.js";
export const createOrder = async (req, res) => {
  try {
    const { total, name, id, items, sellerId } = req.body;

    const options = {
      amount: total * 100, // amount in the smallest currency unit
      currency: "INR",
    };

    const orderCreate = await instance.orders.create(options);

    if (orderCreate) {
      // Generate a random delivery date within a range of 7 days from today
      function generateFakeDeliveryDate() {
        const today = new Date();
        const deliveryDate = new Date();
        deliveryDate.setDate(today.getDate() + getRandomNumber(1, 7));
        return deliveryDate.toDateString();
      }

      // Helper function to generate a random number within a range
      function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      const fakeDeliveryDate = generateFakeDeliveryDate();

      // Decrease the stock of food items
      for (const item of items.items) {
        const foodItem = await FoodItems.findById(item._id);
        if (foodItem) {
          foodItem.stock.sold += 1;
          foodItem.stock.available -= 1;
          await foodItem.save();
        }
      }

      const order = await Order.create({
        order: {
          recivedBy: fakeDeliveryDate,
          total,
        },
        placedBy: {
          name:name,
          Uid:id,
        },
        orderedItems: {
          items: items.items,
          sellerId,
        },
        orderPayments: orderCreate,
      });

      if (order) {
        res.status(200).json({
          success: true,
          message: "Order created successfully",
          data: order,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Order couldn't be created. Please fill the form.",
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: "Something went wrong while creating the order",
      });
    }
  } catch (error) {
  
    console.log(`An error occurred at createOrder: `,error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


export const getOrdersById = async (req, res) => {
  try {
    const { id } = req.query;
const orders = await Order.find({ "placedBy.id": userId });

    if (orders.length > 0) {
      res.status(200).json({
        success: true,
        message: "Orders found",
        data: orders,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }
  } catch (error) {
    console.log(`An error occurred at getOrdersById: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.query;
    const orders = await Order.find({ "placedBy.Uid": userId }); // Corrected the query to access the "Uid" property correctly
    if (orders.length > 0) {
      res.status(200).json({
        success: true,
        message: "Orders found",
        data: orders,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No orders found",
        data: orders,
      });
    }
  } catch (error) {
    console.log(`An error occurred at getOrdersByUserId: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const cancelOrders = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Restore the stock of food items
    const items = order.orderedItems.items;
    for (const item of items) {
      const foodItem = await FoodItems.findById(item.itemId);
      if (foodItem) {
        foodItem.stock.sold -= 1;
        foodItem.stock.available += 1;
        await foodItem.save();
      }
    }

    // Remove the order from the database
    await order.remove();

    res.status(200).json({
      success: true,
      message: "Order canceled successfully",
    });
  } catch (error) {
    console.log(`An error occurred at cancelOrders: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
