import express from "express";
import { protect, isVendor, isAdmin } from "../middleware/authMiddleware.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  createProductReview,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, isAdmin, createProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, isVendor, updateProduct)

  router.post("/:id/reviews", protect, createProductReview);

  

export default router;
