import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const [userName, setUserName] = useState(localStorage.getItem("name") || "");
  const [forceRender, setForceRender] = useState(false);
  const { darkMode, setDarkMode } = useDarkMode();

  useEffect(() => {
    const updateUser = () => {
      const name = localStorage.getItem("name");
      setUserName(name || "");
    };

    window.addEventListener("userUpdated", updateUser);
    return () => window.removeEventListener("userUpdated", updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserName("");
    setForceRender((prev) => !prev);
    navigate("/login");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-[#4a4949] dark:bg-slate-900 w-full shadow-md">
      <div className="mx-auto px-4 md:px-14">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl md:text-4xl font-sixcaps tracking-wider text-yellow-500 dark:text-yellow-300"
          >
            ShopVerse
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center font-reem text-sm font-medium
           space-x-6">
          <Link
              to="/"
              className="relative group text-[#fff] dark:text-white hover:text-gray-300"
            >
            <span className="nav-link-underline">Home</span>  
            </Link>
            {userRole === "customer" && (
              <>
                <Link
                to="/shop"
                className="relative group text-[#fff] dark:text-white hover:text-gray-300"
              >
                <span className="nav-link-underline">Shop</span>
              </Link>
              <Link
                to="/cart"
                className="relative group text-[#fff] dark:text-white hover:text-gray-300 "
              >
                <span className="nav-link-underline">Cart</span>
              </Link>
                <Link
                to="/checkout"
                className="relative group text-[#fff] dark:text-white hover:text-gray-300 "
              >
                <span className="nav-link-underline">Checkout</span>
              </Link>
                <Link
                to="/wishlist"
                className="relative group text-[#fff] dark:text-white hover:text-gray-300 "
              >
                <span className="nav-link-underline">Wishlist</span>
              </Link>
                 <Link
              to="/profile"
              className="relative group text-[#fff] dark:text-white hover:text-gray-300 "
            >
            <span className="nav-link-underline">Profile</span>  
            </Link>
              <Link to="/orders" className="relative group text-[#fff] dark:text-white hover:text-gray-300 ">
            <span className="nav-link-underline"></span>My Orders</Link>
              </>
            )}
            {userRole === "vendor" && (
             <Link
             to="/vendor"
             className="relative group text-[#fff] dark:text-white hover:text-gray-300 "
           >
            <span className="nav-link-underline">Vendor Dashboard</span> 
           </Link>
            )}
            {userRole === "admin" && (
              <Link
              to="/admin"
              className="relative group text-[#fff] dark:text-white hover:text-gray-300 "
            >
            <span className="nav-link-underline">Admin Dashboard</span>  
            </Link>
            
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="ml-4 px-3 rounded-full dark:text-white border-2 border-gray-400"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex space-x-2">

            {userRole ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-[#4e4c3d] font-darker text-xl capitalize font-semibold dark:text-white">{userName || "User"}</span>
                  <div className="w-8 h-8 bg-[#dfdecb] dark:bg-slate-300 rounded-full flex items-center justify-center">🧑</div>
                </div>
                <button onClick={handleLogout} className="bg-[#edece9] text-black font-reem px-5 py-2 rounded hover:bg-white hover:text-black transition duration-300">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="bg-[#e5e2e2] text-black px-6 py-2 rounded-lg font-semibold">Login</Link>
                <Link to="/register" className="bg-[#e4ad09] hover:bg-[#f0b504] text-white px-5 py-2 rounded-lg font-semibold">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={toggleMenu} className="lg:hidden text-2xl text-white dark:text-white hover:text-gray-300 transition-colors">
            <FaBars />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleMenu}
                className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
              />

              {/* Sidebar Menu */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col p-6 overflow-y-auto lg:hidden"
              >
                {/* Header / Close Button */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                  <span className="text-3xl font-sixcaps text-yellow-500 tracking-wider">ShopVerse</span>
                  <button onClick={toggleMenu} className="text-gray-600 dark:text-gray-300 text-2xl hover:text-red-500 transition-colors">
                    <FaTimes />
                  </button>
                </div>

                {/* Mobile Links */}
                <div className="flex flex-col space-y-5 text-lg font-medium text-gray-800 dark:text-gray-200">
                  <Link to="/" onClick={toggleMenu} className="hover:text-yellow-500 transition-colors">Home</Link>
                  {userRole === "customer" && (
                    <>
                      <Link to="/shop" onClick={toggleMenu} className="hover:text-yellow-500 transition-colors">Shop</Link>
                      <Link to="/cart" onClick={toggleMenu} className="hover:text-yellow-500 transition-colors">Cart</Link>
                      <Link to="/checkout" onClick={toggleMenu} className="hover:text-yellow-500 transition-colors">Checkout</Link>
                      <Link to="/wishlist" onClick={toggleMenu} className="hover:text-yellow-500 transition-colors">Wishlist</Link>
                      <Link to="/orders" onClick={toggleMenu} className="hover:text-yellow-500 transition-colors">My Orders</Link>
                    </>
                  )}
                  {userRole === "vendor" && (
                    <Link to="/vendor" onClick={toggleMenu} className="hover:text-yellow-500 transition-colors">Vendor Dashboard</Link>
                  )}
                  {userRole === "admin" && (
                    <Link to="/admin" onClick={toggleMenu} className="hover:text-yellow-500 transition-colors">Admin Dashboard</Link>
                  )}
                  <Link to="/profile" onClick={toggleMenu} className="hover:text-yellow-500 transition-colors">Profile</Link>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col space-y-4">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="w-full text-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    {darkMode ? "☀️ Switch to Light Mode" : "🌙 Switch to Dark Mode"}
                  </button>

                  {userRole ? (
                    <div className="flex flex-col items-center gap-4 pt-4">
                      <div className="flex items-center space-x-3 w-full justify-center bg-gray-50 dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {(userName || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-white capitalize text-lg">{userName || "User"}</span>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          toggleMenu();
                        }}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3 pt-4">
                      <Link to="/login" onClick={toggleMenu} className="w-full border border-gray-800 dark:border-gray-300 text-gray-800 dark:text-gray-200 text-center font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm">
                        Login
                      </Link>
                      <Link to="/register" onClick={toggleMenu} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-center px-6 py-3 rounded-lg shadow-md transition-colors">
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
