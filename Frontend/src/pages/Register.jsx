import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.password) {
      setMessage("All fields are required!");
      return;
    }

    try {
      await axios.post(
        "https://multivendor-ti71.onrender.com/api/auth/register",
        user
      );
      setMessage("Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex w-full max-w-5xl bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden card-enter min-h-[600px]">
        
        {/* LEFT IMAGE SECTION */}
        <div className="hidden lg:flex w-1/2 relative bg-gray-100 dark:bg-slate-700 overflow-hidden">
          <div className="absolute inset-0 bg-gray-900/20 mix-blend-multiply z-10" />
          <img
            src="/register.jpg"
            alt="Register Visual"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent z-10 flex items-end p-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Join the Community</h2>
              <p className="text-gray-200">Create an account to start shopping or selling securely.</p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-full lg:w-1/2 p-10 sm:p-14 flex flex-col justify-center">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Get Started
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3">
              Create your account in just a few steps.
            </p>
          </div>

          {message && (
            <div className={`mb-6 flex items-center gap-3 rounded-2xl px-5 py-4 ${
              message.includes("failed") || message.includes("required") 
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" 
                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
            }`}>
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="hello@example.com"
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Account Type</label>
              <div className="relative">
                <select
                  className="w-full appearance-none px-5 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white font-medium transition-all"
                  value={user.role}
                  onChange={(e) => setUser({ ...user, role: e.target.value })}
                >
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm flex justify-center items-center gap-2"
            >
              Create Account
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-8">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="font-bold text-gray-900 dark:text-white cursor-pointer hover:underline transition-all"
            >
              Log in instead
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
