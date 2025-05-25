import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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
      const res = await axios.post("http://localhost:5000/api/auth/login", user);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("isVerified", "false");
      setMessage("Login successful! Sending OTP...");

      await axios.post("http://localhost:5000/api/otp/send", {
        email: res.data.email,
      });

      window.dispatchEvent(new Event("userUpdated"));

      setMessage("OTP sent! Redirecting...");
      navigate("/verify-otp", { state: { email: user.email } });

    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed!");
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
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
            </svg>
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-800 mb-1 dark:text-gray-200">Welcome Back!</h2>
        <p className="text-center text-sm text-gray-500 mb-6 dark:text-gray-400">
          We missed you! Please enter your details.
        </p>

        {message && <p className="text-center text-green-600 mb-4">{message}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-black"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-black"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-purple-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
