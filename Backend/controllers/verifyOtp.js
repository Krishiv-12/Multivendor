import jwt from "jsonwebtoken";
import User from "../models/User.js"
import Otp from "../models/otpModel.js";

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }
    try {
      const record = await Otp.findOne({ email, otp });
      if (!record) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // ✅ Generate token now
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      // Optionally, delete OTP record
      await Otp.deleteOne({ _id: record._id });
  
      res.status(200).json({
        success: true,
        message: "OTP verified",
        token, // send token here
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };