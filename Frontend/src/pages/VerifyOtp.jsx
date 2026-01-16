import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp || !email) {
      setMessage("Missing OTP or Email");
      return;
    }

    try {
      const res = await axios.post(
        "https://multivendor-ti71.onrender.com/api/otp/verify",
        { email, otp }
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("isVerified", "true");
        localStorage.removeItem("email");
        setMessage("OTP verified successfully.");

        const role = localStorage.getItem("role");
        setTimeout(() => {
          if (role === "admin") navigate("/admin");
          else if (role === "vendor") navigate("/vendor");
          else navigate("/");
        }, 1500);
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setMessage("Error verifying OTP");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              className="h-7 w-7 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm0 0v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Code Verification
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          We have sent a verification code to your email
        </p>

        {/* Message */}
        {message && (
          <div className="mt-4 text-center text-sm font-medium text-green-600">
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerify} className="mt-6 space-y-6">
          
          {/* OTP Input */}
          <input
            type="text"
            maxLength="6"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full text-center tracking-[0.4em] text-lg font-semibold rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full rounded-full bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Verify Account
          </button>
        </form>

        {/* Resend */}
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

export default VerifyOtp;
