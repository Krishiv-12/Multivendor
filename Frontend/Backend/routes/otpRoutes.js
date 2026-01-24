import express from "express";
import { sendOTP } from "../controllers/otpController.js";
import { verifyOtp } from "../controllers/verifyOtp.js";

const router = express.Router();

router.post("/send", sendOTP);
router.post("/verify", verifyOtp);

export default router;
