import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const uploadResult = await cloudinaryV2.uploader.upload(dataURI, {
      folder: "ecommerce-products",
    });

    res.json({ imageUrl: uploadResult.secure_url });

  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

export default router;
