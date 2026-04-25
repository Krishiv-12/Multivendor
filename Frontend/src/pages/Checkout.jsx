import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../components/Toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { cart = [], totalPrice = 0 } = state || {};
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpay = () => {
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.zip) {
      showToast("Please fill in all shipping details.", "error");
      return;
    }

    setLoading(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      showToast("Razorpay SDK failed to load. Check your connection.", "error");
      setLoading(false);
    };
    script.onload = () => handlePayment();
    document.body.appendChild(script);
  };

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(
        "https://multivendor-ti71.onrender.com/api/payment/create-order",
        { amount: totalPrice },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        name: "MultiVendor Store",
        description: "Product Purchase",
        order_id: data.order.id,
        handler: function (response) {
          createFinalOrder(response);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
        },
        theme: {
          color: "#0f172a", // slate-900
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        showToast("Payment failed. Please try again.", "error");
        setLoading(false);
      });
      rzp.open();
    } catch (error) {
      showToast("Could not initialize payment.", "error");
      console.error(error);
      setLoading(false);
    }
  };

  const createFinalOrder = async (paymentInfo) => {
    try {
      await axios.post(
        "https://multivendor-ti71.onrender.com/api/orders",
        {
          cartItems: cart,
          shippingInfo: formData,
          paymentInfo,
          amount: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFormData({
        name: "",
        email: "",
        address: "",
        city: "",
        zip: "",
      });

      navigate("/success");
    } catch (error) {
      console.error("Order creation failed", error);
      showToast("Payment succeeded, but order creation failed. Contact support.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-20 px-4 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
        <button onClick={() => navigate("/shop")} className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-10 transition-colors duration-300">
      {ToastComponent}
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="mb-8 card-enter">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-1">
            Secure Checkout
          </p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Shipping & Payment
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700 card-enter" style={{ animationDelay: "100ms" }}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Shipping Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400"
                    onChange={handleChange}
                    value={formData.name}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="hello@example.com"
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400"
                    onChange={handleChange}
                    value={formData.email}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="123 Main St"
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400"
                    onChange={handleChange}
                    value={formData.address}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="New York"
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400"
                    onChange={handleChange}
                    value={formData.city}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">ZIP / Postal Code</label>
                  <input
                    type="text"
                    name="zip"
                    placeholder="10001"
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400"
                    onChange={handleChange}
                    value={formData.zip}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700 sticky top-6 card-enter" style={{ animationDelay: "200ms" }}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4 items-center">
                    <img src={item.images?.[0]?.replace("/upload/", "/upload/w_100,h_100,c_fill,f_auto,q_auto/") || "https://via.placeholder.com/100"} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100 dark:bg-slate-700" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-slate-700 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Free</span>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-slate-700 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                onClick={loadRazorpay}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold transition-all duration-300 shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Pay Securely
                  </>
                )}
              </button>
              <div className="mt-4 flex justify-center items-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Payments are securely processed by Razorpay
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Checkout;
