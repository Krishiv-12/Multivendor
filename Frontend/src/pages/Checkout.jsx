import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { cart = [], totalPrice = 0 } = state || {};

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
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => alert("Razorpay SDK failed to load.");
    script.onload = () => handlePayment();
    document.body.appendChild(script);
  };

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
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
          // 🔥 Order Create Request to Backend
          createFinalOrder(response);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Payment failed");
      console.error(error);
    }
  };

  const createFinalOrder = async (paymentInfo) => {
    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        {
          cartItems: cart,
          shippingInfo: formData,
          paymentInfo,
          amount: totalPrice, // ✅ Add this
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
        totalPrice: "",
      });

      navigate("/success");
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Order creation failed", error);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="border p-2 w-full dark:text-black"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full dark:text-black"
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="border p-2 w-full dark:text-black"
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          className="border p-2 w-full dark:text-black"
          onChange={handleChange}
        />
        <input
          type="text"
          name="zip"
          placeholder="ZIP Code"
          className="border p-2 w-full dark:text-black"
          onChange={handleChange}
        />
      </div>

      <div className="mt-6 font-semibold text-lg flex justify-between">
        <p>Total Amount:</p>
        <p>₹{totalPrice.toFixed(2)}</p>
      </div>

      <button
        onClick={loadRazorpay}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg w-full"
      >
        Pay with Razorpay
      </button>
    </div>
  );
};

export default Checkout;
