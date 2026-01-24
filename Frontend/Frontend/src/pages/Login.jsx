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
    <div className="flex items-center justify-center py-4">
      <div className="flex w-full max-w-5xl h-[540px] rounded-2xl overflow-hidden">
        {/* LEFT IMAGE SECTION */}
        <div className="hidden md:flex w-1/2 bg-black relative">
          <img
            src="https://i.pinimg.com/1200x/60/a3/de/60a3de7769d3e52a826d64efc8e92c77.jpg"
            alt="Login Visual"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-full md:w-1/2 p-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
              ✳
            </div>
            <h2 className="text-4xl font-darker font-semibold">Welcome Back</h2>
          </div>

          <p className="text-gray-500 mb-6">
            Login to continue shopping smarter.
          </p>

          {message && (
            <div className="mb-4 flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-blue-700">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Your email"
              className="w-full text-black px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Your password"
              className="w-full text-black px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />

            <button
              type="submit"
              className="w-full bg-[#FFBE00] hover:bg-[#f0b504] text-white py-3 rounded-lg font-medium transition"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-yellow-500 font-medium cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
