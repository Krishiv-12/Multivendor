import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { cartItems, shippingInfo, amount, paymentInfo } = req.body;

    const orderedProducts = cartItems.map((item) => ({
      product: item._id,
      quantity: item.quantity,
    }));


    if (!orderedProducts || !shippingInfo || !amount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const order = new Order({
      user: req.user._id,
      orderedProducts,
      shippingInfo,
      amount,
      paymentInfo,
    });

    await order.save();

    res.status(201).json({ success: true, message: "Order created", order });
  } catch (error) {
    console.error("🔴 Order creation error:", error);
    res.status(500).json({ success: false, message: "Order creation failed", error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderedProducts.product", "name price images")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

export const cancelOrderByUser = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ _id: orderId, user: req.user._id });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.orderStatus !== "Processing") {
      return res.status(400).json({ success: false, message: "Only processing orders can be cancelled." });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.json({ success: true, message: "Order cancelled successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to cancel order." });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status", error: err.message });
  }
};