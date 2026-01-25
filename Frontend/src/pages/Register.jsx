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
    <div className="flex items-center justify-center py-4">
      <div className="flex rounded-2xl overflow-hidden bg-white dark:bg-gray-700">
        
        {/* LEFT IMAGE SECTION */}
        <div className="hidden md:flex w-1/2 bg-black relative">
          <img
            src="https://i.pinimg.com/1200x/3b/e9/90/3be990a833d279e40430b40877947e54.jpg"
            alt="Register Visual"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-full md:w-1/2 p-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#FFBE00] flex items-center justify-center text-white font-bold">
              ✳
            </div>
            <h2 className="text-4xl font-darker font-semibold">Get Started</h2>
          </div>

          <p className="text-gray-500 dark:text-gray-200 mb-6">
                        Create your account. Start shopping smarter.

          </p>

          {message && (
            <p className="mb-4 text-sm text-center text-green-600">
              {message}
            </p>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              className="w-full text-black px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={user.name}
              onChange={(e) =>
                setUser({ ...user, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Your email"
              className="w-full text-black px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={user.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Create new password"
              className="w-full text-black px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={user.password}
              onChange={(e) =>
                setUser({ ...user, password: e.target.value })
              }
            />

            {/* ROLE SELECT */}
            <select
              className="w-full text-black font-semibold px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={user.role}
              onChange={(e) =>
                setUser({ ...user, role: e.target.value })
              }
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="w-full bg-[#FFBE00] hover:bg-[#f0b504] text-white py-3 rounded-lg font-medium transition"
            >
              Create new account
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 dark:text-gray-300 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-yellow-500 font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
