import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      setMessage("All fields are required!");
      return;
    }

    try {
      const res = await axios.post(
        "https://multivendor-ti71.onrender.com/api/auth/login",
        user
      );

      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("isVerified", "false");

      setMessage("Verifying credentials...");
      setTimeout(() => {
        setMessage("OTP sent securely to your email.");
      }, 1500);

      await axios.post("https://multivendor-ti71.onrender.com/api/otp/send", {
        email: res.data.email,
      });

      window.dispatchEvent(new Event("userUpdated"));
      navigate("/verify-otp", { state: { email: user.email } });
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex w-full max-w-5xl bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden card-enter min-h-[600px]">
        
        {/* LEFT IMAGE SECTION */}
        <div className="hidden lg:flex w-1/2 relative bg-gray-100 dark:bg-slate-700 overflow-hidden">
          <div className="absolute inset-0 bg-gray-900/20 mix-blend-multiply z-10" />
          <img
            src="/login.jpg"
            alt="Login Visual"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent z-10 flex items-end p-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-200">Sign in to discover premium products curated just for you.</p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-full lg:w-1/2 p-10 sm:p-14 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Sign In
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3">
              Login to continue shopping smarter.
            </p>
          </div>

          {message && (
            <div className={`mb-6 flex items-center gap-3 rounded-2xl px-5 py-4 ${
              message.includes("failed") || message.includes("required") 
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" 
                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
            }`}>
              {!message.includes("failed") && !message.includes("required") && (
                <svg className="h-5 w-5 animate-spin shrink-0" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="hello@example.com"
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm flex justify-center items-center gap-2"
            >
              Sign In
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-8">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="font-bold text-gray-900 dark:text-white cursor-pointer hover:underline transition-all"
            >
              Create one now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
