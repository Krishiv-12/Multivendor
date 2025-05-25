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
        const res = await axios.get("https://multivendor-ti71.onrender.com/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Profile updated successfully!");
      localStorage.setItem("name", res.data.name); // Update navbar name
    } catch (err) {
      setMessage("Update failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      {message && <p className="text-blue-600">{message}</p>}
      <p className="mb-2">Email: <strong>{user.email}</strong></p>
      <p className="mb-4">Role: <strong>{user.role}</strong></p>

      <input
        className="border p-2 w-full mb-3 dark:text-black"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="Update Name"
      />
      <input
        type="password"
        className="border p-2 w-full mb-3 dark:text-black"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password (optional)"
      />
      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update Profile
      </button>
    </div>
  );
};

export default Profile;
