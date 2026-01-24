import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
  getAllProducts,
  getAdminStats,
  toggleUserBan,
  deleteProduct,
  updateProduct,
  getAllVendors
} from "../controllers/adminController.js";

import { createProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/users", protect, isAdmin, getAllUsers);
router.put("/users/:id", protect, isAdmin, updateUserRole);
router.put("/users/:id/ban", protect, isAdmin, toggleUserBan);
router.delete("/users/:id", protect, isAdmin, deleteUser);
router.delete("/products/:id", protect, isAdmin, deleteProduct);

router.get("/vendors", protect, isAdmin, getAllVendors);
router.get("/orders", protect, isAdmin, getAllOrders);
router.get("/products", protect, isAdmin, getAllProducts);
router.put("/products/:id", protect, isAdmin, updateProduct);
router.get("/stats", protect, isAdmin, getAdminStats);
router.post("/products", protect, isAdmin, createProduct);


export default router;
