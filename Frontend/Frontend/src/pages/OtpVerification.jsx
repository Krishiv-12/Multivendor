import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://multivendor-ti71.onrender.com/api/otp/verify",
        { email, otp }
      );

      setMessage("OTP verified successfully. Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "OTP verification failed!"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          🔐
        </div>

        {/* Heading */}
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Code Verification
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          We’ve sent a verification code to your email
        </p>

        {/* Message */}
        {message && (
          <div className="mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700 text-center">
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerify} className="mt-6 space-y-5">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center tracking-widest text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Verify Account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Didn’t receive the code?{" "}
          <span className="cursor-pointer text-blue-600 hover:underline">
            Resend
          </span>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
