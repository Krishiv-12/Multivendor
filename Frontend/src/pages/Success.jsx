import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-green-600">🎉 Payment Successful!</h2>
      <p className="mt-4 text-lg">Thank you for your purchase. Your order has been placed.</p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded"
      >
        🏠 Go to Home
      </button>
    </div>
  );
};

export default Success;
