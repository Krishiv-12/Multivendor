// src/pages/Profile.jsx

import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const [newName, setNewName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://multivendor-ti71.onrender.com/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data);
        setNewName(res.data.name);
      } catch (err) {
        setMessage("Failed to load profile");
      }
    };
    fetchProfile();
  }, [token]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "https://multivendor-ti71.onrender.com/api/user/profile",
        { name: newName, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Profile updated successfully!");
      localStorage.setItem("name", res.data.name);
    } catch (err) {
      setMessage("Update failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-start justify-center px-4 mt-12">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-semibold">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-darker font-semibold text-gray-800 dark:text-white">
              My Profile
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your personal information
            </p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-4 text-sm text-center px-4 py-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
            {message}
          </div>
        )}

        {/* Profile Info */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {user.email}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Role</span>
            <span className="font-medium capitalize text-gray-800 dark:text-gray-200">
              {user.role}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t dark:border-slate-700 my-6"></div>

        {/* Update Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Full Name
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-black"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Update name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </div>

          <button
            onClick={handleUpdate}
            className="w-full mt-2 bg-black text-white  hover:bg-white hover:text-black py-2.5 rounded-lg font-semibold  border border-gray-300 transition duration-300"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
