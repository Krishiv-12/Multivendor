import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from 'body-parser';
import path from "path";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import uploadRoute from "./routes/uploadRoutes.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
const app = express();
const __dirname = path.resolve(); // ✅ small typo fix from "_dirname" to "__dirname"

// ✅ Setup allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://multivendor-ti71.onrender.com'
];

// ✅ CORS setup before any routes
app.use(cors({
  origin: function (origin, callback) {
    // Handle no-origin requests like Postman or same-origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked CORS request from:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/user", userRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/upload", uploadRoute);

// ✅ Serve frontend static files
app.use(express.static(path.join(__dirname, "/Frontend/dist")));
app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
});

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
