import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import VendorDashboard from "./pages/pages/VendorDashboard";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import VerifyOtp from "./pages/VerifyOtp";
import Success from "./pages/Success";
import OrderHistory from "./pages/OrderHistory";
import AdminOrders from "./pages/AdminOrders";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" />;

  return element;
};

function App() {
  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] dark:bg-gray-700 dark:text-white">
    <CartProvider>
      <Router>
        <Navbar />
        <ToastContainer position="top-right" autoClose={2000} />{" "}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/success" element={<Success />} />
            <Route path="/orders" element={<OrderHistory />} />



            {/* Customer Route */}
            <Route element={<PrivateRoute allowedRoles={["customer"]} />}>
            <Route path="/shop" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            </Route>


            {/* Admin Route */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/adminorder" element={<AdminOrders />} />
            </Route>
            {/* Vendor Route */}
            <Route element={<PrivateRoute allowedRoles={["vendor"]} />}>
              <Route path="/vendor" element={<VendorDashboard />} />
            </Route>
          </Routes>
        <Footer />
      </Router>
    </CartProvider>
    </div>
  );
}

export default App;
