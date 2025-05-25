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
      const res = await axios.post("http://localhost:5000/api/otp/verify", {
        email,
        otp,
      });

      setMessage("OTP verified successfully!");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "OTP verification failed!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
      {message && <p className="text-green-500">{message}</p>}
      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter OTP"
          className="border p-2 rounded"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OtpVerification;

//haef daoq xukr argm
