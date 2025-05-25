import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp || !email) {
      setMessage("Missing OTP or Email");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/otp/verify", {
        email,
        otp,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("isVerified", "true");
        localStorage.removeItem("email");
        setMessage("OTP Verified Successfully!");

        const role = localStorage.getItem("role");
        setTimeout(() => {
          if (role === "admin") navigate("/admin");
          else if (role === "vendor") navigate("/vendor");
          else navigate("/");
        }, 1500);

      } else {
        setMessage("Invalid OTP!");
      }
    } catch (err) {
      setMessage("Error verifying OTP");
    }
  };

  return (
    <div className="flex mt-16 justify-center">
      <div className="h-[75vh] shadow-xl rounded-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-purple-200 p-3 rounded-full">
            <svg
              className="w-6 h-6 text-purple-700"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
            </svg>
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-800 mb-1">OTP Verification</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Please enter the OTP sent to your email.</p>

        {message && <p className="text-center text-green-600 mb-4">{message}</p>}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
