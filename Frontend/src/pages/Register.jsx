import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "", role: "customer" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.password) {
      setMessage("All fields are required!");
      return;
    }

    try {
      const res = await axios.post("https://multivendor-ti71.onrender.com/api/auth/register", user);
      setMessage("Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed!");
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

        <h2 className="text-center text-2xl font-bold text-gray-800 mb-2 dark:text-gray-200">Create an account</h2>
        <p className="text-center text-sm text-gray-500 mb-6 dark:text-gray-400">
          Sign up to access exclusive features, personalized content, and start your journey with us!
        </p>

        {message && <p className="text-center text-green-600 mb-2">{message}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-black"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-black"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-black"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          {/* Role Select Dropdown */}
          <select
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-black"
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4 dark:text-gray-400">
          Already a member?{" "}
          <span
            className="text-purple-600 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
