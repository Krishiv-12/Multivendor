// src/pages/Profile.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "../components/Toast";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const [newName, setNewName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { showToast, ToastComponent } = useToast();

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
        showToast("Failed to load profile", "error");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        "https://multivendor-ti71.onrender.com/api/user/profile",
        { name: newName, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showToast("Profile updated successfully!", "success");
      localStorage.setItem("name", res.data.name);
      setUser(prev => ({ ...prev, name: res.data.name }));
      setPassword("");
    } catch (err) {
      showToast("Profile update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 dark:border-slate-700 dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 transition-colors duration-300 py-12">
      {ToastComponent}
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 p-8 sm:p-10 card-enter">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
          <div className="w-20 h-20 shrink-0 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-3xl font-bold shadow-md">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="mt-2 sm:mt-0">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              My Profile
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your personal information
            </p>
          </div>
        </div>

        {/* Profile Info Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Email</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={user.email}>
              {user.email}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Role</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">
              {user.role}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-slate-700 my-8"></div>

        {/* Update Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Update your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
            />
          </div>

          <button
            onClick={handleUpdate}
            disabled={loading || (!password && newName === user.name)}
            className="w-full mt-4 py-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold transition-all duration-300 shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
