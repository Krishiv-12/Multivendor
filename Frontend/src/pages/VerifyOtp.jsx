import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp || !email) {
      setMessage("Missing OTP or Email");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://multivendor-ti71.onrender.com/api/otp/verify",
        { email, otp }
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("isVerified", "true");
        localStorage.removeItem("email");
        setMessage("OTP verified successfully. Redirecting...");

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
      setMessage("Error verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 transition-colors duration-300 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 p-10 card-enter">
        
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center shadow-sm">
            <svg
              className="h-8 w-8 text-gray-900 dark:text-white"
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Verify Your Email
          </h2>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            We sent a verification code to <span className="font-semibold text-gray-700 dark:text-gray-300">{email || "your email"}</span>
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 flex items-center justify-center gap-2 rounded-xl px-4 py-3 ${
            message.includes("Error") || message.includes("Invalid") || message.includes("Missing")
              ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" 
              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
          }`}>
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input
              type="text"
              maxLength="6"
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center tracking-[0.75em] text-2xl font-bold bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full py-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 dark:hover:bg-gray-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : "Verify Account"}
          </button>
        </form>

        {/* Resend */}
        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Didn’t receive the code?{" "}
          <span className="cursor-pointer font-bold text-gray-900 dark:text-white hover:underline transition-all">
            Resend Code
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
