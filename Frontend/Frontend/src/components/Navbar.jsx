import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";

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
    <nav className="bg-[#4a4949] dark:bg-slate-700 w-full shadow-md">
      <div className="mx-auto px-4 md:px-14">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl md:text-4xl font-reem font-bold text-[#ffff] dark:text-blue-300"
          >
            ShopVerse
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex font-semibold items-center font-darker text-lg space-x-6">
          <Link
              to="/"
              className="relative group text-[#fff] dark:text-white hover:text-gray-300 font-semibold"
            >
            <span className="nav-link-underline">Home</span>  
            </Link>
            {userRole === "customer" && (
              <>
                <Link
                to="/shop"
                className="relative group text-[#fff] dark:text-white hover:text-gray-300 font-semibold"
              >
                <span className="nav-link-underline">Shop</span>
              </Link>
              <Link
                to="/cart"
                className="relative group text-[#fff] dark:text-white hover:text-gray-300 font-semibold"
              >
                <span className="nav-link-underline">Cart</span>
              </Link>
                <Link
                to="/checkout"
                className="relative group text-[#fff] dark:text-white hover:text-gray-300 font-semibold"
              >
                <span className="nav-link-underline">Checkout</span>
              </Link>
                <Link
                to="/wishlist"
                className="relative group text-[#fff] dark:text-white hover:text-gray-300 font-semibold"
              >
                <span className="nav-link-underline">Wishlist</span>
              </Link>
                 <Link
              to="/profile"
              className="relative group text-[#fff] dark:text-white hover:text-gray-300 font-semibold"
            >
            <span className="nav-link-underline">Profile</span>  
            </Link>
              <Link to="/orders" className="relative group text-[#fff] dark:text-white hover:text-gray-300 font-semibold">
            <span className="nav-link-underline"></span>My Orders</Link>
              </>
            )}
            {userRole === "vendor" && (
             <Link
             to="/vendor"
             className="relative group text-[#fff] dark:text-white hover:text-gray-300 font-semibold"
           >
            <span className="nav-link-underline">Vendor Dashboard</span> 
           </Link>
            )}
            {userRole === "admin" && (
              <Link
              to="/admin"
              className="relative group text-[#fff] dark:text-white hover:text-gray-300 font-semibold"
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
                <button onClick={handleLogout} className="bg-[#edece9] text-black font-reem px-5 py-2 rounded-lg hover:bg-white hover:text-black transition duration-300">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="bg-[#e5e2e2] text-black px-6 py-2 rounded-full font-semibold">Login</Link>
                <Link to="/register" className="bg-[#e4ad09] hover:bg-[#f0b504] text-white px-6 py-2 rounded-full font-semibold">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={toggleMenu} className="lg:hidden text-3xl text-white dark:text-white">
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden flex flex-col space-y-4 py-4 border-t border-gray-400 dark:border-gray-600">
            <Link to="/" onClick={toggleMenu} className="text-white dark:text-white hover:text-blue-600">Home</Link>
            {userRole === "customer" && (
              <>
                <Link to="/shop" onClick={toggleMenu} className="text-white dark:text-white hover:text-blue-600">Shop</Link>
                <Link to="/cart" onClick={toggleMenu} className="text-white dark:text-white hover:text-blue-600">Cart</Link>
                <Link to="/checkout" onClick={toggleMenu} className="text-white dark:text-white hover:text-blue-600">Checkout</Link>
                <Link to="/wishlist" onClick={toggleMenu} className="text-white dark:text-white hover:text-blue-600">Wishlist</Link>
                <Link to="/orders" onClick={toggleMenu} className="text-white dark:text-white hover:text-blue-600">My Orders</Link>
              </>
            )}
            {userRole === "vendor" && (
              <Link to="/vendor" onClick={toggleMenu} className="text-white dark:text-white hover:text-blue-600">Vendor Dashboard</Link>
            )}
            {userRole === "admin" && (
              <Link to="/admin" onClick={toggleMenu} className="text-white dark:text-white hover:text-blue-600">Admin Dashboard</Link>
            )}
            <Link to="/dashboard" onClick={toggleMenu} className="text-white dark:text-white hover:text-blue-600">Dashboard</Link>
            <Link to="/profile" onClick={toggleMenu} className="text-white dark:text-white hover:text-blue-600">Profile</Link>

            <button
              onClick={() => {
                setDarkMode(!darkMode);
              }}
              className="w-fit px-4 py-2 rounded bg-gray-200 dark:bg-gray-500 text-black dark:text-white"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            {userRole ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-white dark:text-white font-semibold">{userName || "User"}</span>
                  <div className="w-8 h-8 bg-gray-400 dark:bg-slate-300 rounded-full flex items-center justify-center">🧑</div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="bg-[#FFBE00] text-white px-6 py-2 rounded-full mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleMenu} className="bg-[#fff] text-black text-center font-semibold px-6 py-2 rounded-full">Login</Link>
                <Link to="/register" onClick={toggleMenu} className="bg-[#e4ad09] text-white font-semibold text-center px-6 py-2 rounded-full">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
