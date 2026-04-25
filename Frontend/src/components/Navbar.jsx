import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const [userName, setUserName] = useState(localStorage.getItem("name") || "");
  const [forceRender, setForceRender] = useState(false);
  const { darkMode, setDarkMode } = useDarkMode();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  const navLinks = [
    { name: "Home", path: "/", role: "all" },
    { name: "Shop", path: "/shop", role: "customer" },
    { name: "Cart", path: "/cart", role: "customer" },
    { name: "Checkout", path: "/checkout", role: "customer" },
    { name: "Wishlist", path: "/wishlist", role: "customer" },
    { name: "Orders", path: "/orders", role: "customer" },
    { name: "Vendor Dashboard", path: "/vendor", role: "vendor" },
    { name: "Admin Dashboard", path: "/admin", role: "admin" },
  ];

  const filteredLinks = navLinks.filter(
    (link) => link.role === "all" || link.role === userRole
  );

  return (
    <nav className={`sticky top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm py-3' : 'bg-white dark:bg-slate-950 py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-black tracking-tight text-gray-900 dark:text-white relative group"
          >
            Shop<span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-900 dark:from-gray-400 dark:to-white">Verse</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 dark:bg-white transition-all group-hover:w-full"></span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {filteredLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-gray-900 dark:bg-white transition-all group-hover:w-full opacity-0 group-hover:opacity-100"></span>
              </Link>
            ))}

            {userRole === "customer" && (
              <Link
                to="/profile"
                className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors relative group"
              >
                Profile
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-gray-900 dark:bg-white transition-all group-hover:w-full opacity-0 group-hover:opacity-100"></span>
              </Link>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>

            {userRole ? (
              <div className="flex items-center space-x-4 pl-6 border-l border-gray-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center font-bold text-sm">
                    {(userName || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">{userName.split(' ')[0] || "User"}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-6 border-l border-gray-200 dark:border-slate-700">
                <Link to="/login" className="px-5 py-2 text-sm font-bold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Log in</Link>
                <Link to="/register" className="px-5 py-2 text-sm font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-transform hover:scale-105 active:scale-95 shadow-sm">Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            <button 
              onClick={toggleMenu} 
              className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none z-50"
              aria-label="Toggle Menu"
            >
              <span className={`block w-6 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0 translate-x-2' : 'opacity-100'}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm z-40 lg:hidden h-screen"
            />

            {/* Sidebar panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-[85%] sm:w-[320px] max-w-sm bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col p-6 lg:hidden border-l border-gray-100 dark:border-slate-800 overflow-hidden"
            >
              {/* Close Button Header */}
              <div className="flex justify-between items-center mb-6 pt-2">
                <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">ShopVerse</span>
                <button 
                  onClick={toggleMenu} 
                  className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2">
                {/* Profile / Auth Header */}
                <div className="mb-8">
                {userRole ? (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                    <div className="w-12 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center font-bold text-xl">
                      {(userName || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back,</p>
                      <h3 className="font-bold text-gray-900 dark:text-white capitalize text-lg">{userName || "User"}</h3>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link to="/login" onClick={toggleMenu} className="w-full py-3.5 px-4 text-center rounded-xl border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                      Log In
                    </Link>
                    <Link to="/register" onClick={toggleMenu} className="w-full py-3.5 px-4 text-center rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-md">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">Navigation</p>
                {filteredLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link 
                      to={link.path} 
                      onClick={toggleMenu} 
                      className="flex items-center px-4 py-3 rounded-xl text-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-all"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                {userRole === "customer" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + filteredLinks.length * 0.05 }}
                  >
                    <Link 
                      to="/profile" 
                      onClick={toggleMenu} 
                      className="flex items-center px-4 py-3 rounded-xl text-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-all"
                    >
                      Profile
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Footer / Logout */}
              {userRole && (
                <div className="mt-auto pt-8 pb-4">
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </div>
              )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
