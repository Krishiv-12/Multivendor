import nodemailer from "nodemailer";
import Otp from "../models/otpModel.js"
import dotenv from "dotenv";
dotenv.config();


export const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.create({ email, otp });

  // Setup Nodemailer
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or use SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "your_email@gmail.com",
    to: email,
    subject: "Your OTP for Login",
    text: `Your OTP is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

