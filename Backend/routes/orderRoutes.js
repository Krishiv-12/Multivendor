import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { protect, isVendor, isAdmin } from "../middleware/authMiddleware.js";
import {
  cancelOrderByUser,
  createOrder,
  getUserOrders,
  getVendorOrders,
  updateOrderStatus,
  updateOrderStatusByVendor,
} from "../controllers/orderController.js";

const router = express.Router();


router.post("/", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);
router.get("/vendor-orders", protect, isVendor, getVendorOrders);
router.put("/vendor-status/:orderId", protect, isVendor, updateOrderStatusByVendor);
router.put("/cancel/:orderId", protect, cancelOrderByUser);
router.put("/status/:orderId", protect, isAdmin, updateOrderStatus);
router.put("/admin/order/:orderId", protect, isAdmin, updateOrderStatus);


export default router;
