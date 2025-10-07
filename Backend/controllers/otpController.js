import dotenv from "dotenv";
import Otp from "../models/otpModel.js";
import SibApiV3Sdk from "@sendinblue/client";
dotenv.config();

// ✅ Send OTP Controller
export const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // ✅ Save OTP in MongoDB
  try {
    const savedOtp = await Otp.create({ email, otp });
    console.log("✅ OTP saved to DB:", savedOtp);
  } catch (dbErr) {
    console.error("❌ OTP DB Error:", dbErr);
    return res.status(500).json({ message: "Failed to save OTP" });
  }

  // ✅ Setup Brevo (Sendinblue) client
  const brevo = new SibApiV3Sdk.TransactionalEmailsApi();
  brevo.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

  // ✅ Email data
  const emailData = {
    sender: { email: process.env.EMAIL_FROM, name: "Multivendor App" },
    to: [{ email }],
    subject: "Your OTP for Login",
    textContent: `Your OTP is ${otp}`,
    htmlContent: `<h2>Your OTP is: <b>${otp}</b></h2>
                  <p>This OTP will expire in 5 minutes.</p>`,
  };

  // ✅ Send email via Brevo API
  try {
    const response = await brevo.sendTransacEmail(emailData);
    console.log("✅ Email sent via Brevo:", response);
    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("❌ Email sending error (Brevo):", error);
    res.status(500).json({ message: "Failed to send OTP", error });
  }
};
