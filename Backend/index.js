import express from "express"
import dotenv from "dotenv"
import cors from "cors";

import connectDB from "./config/db.js";


import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import otpRoutes from "./routes/otpRoutes.js";
import uploadRoute from "./routes/uploadRoutes.js";
import path from "path";


dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

const _dirname = path.resolve()

app.use(cors());

app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/user", userRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/upload", uploadRoute);


app.use(express.static(path.join(_dirname, "/Frontend/dist")))
app.get('*', (_ , res ) => {
  res.sendFile(path.resolve(_dirname, "Frontend", "dist", "index.html"))
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));