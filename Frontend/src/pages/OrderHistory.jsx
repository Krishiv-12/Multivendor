import { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "https://multivendor-ti71.onrender.com/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching order history", error);
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    try {
      const { data } = await axios.put(
        `https://multivendor-ti71.onrender.com/api/orders/cancel/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(data.message);
      // Refresh orders
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: "Cancelled" } : order
        )
      );
    } catch (error) {
      alert("Failed to cancel order.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">🧾 Order History</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="border p-4 mb-4 rounded shadow">
            <p className="font-semibold">Order ID: {order._id}</p>
            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Status: {order.orderStatus}</p>
            <p>Total Amount: ₹{order.amount}</p>

            <div className="mt-2">
              <h4 className="font-semibold">Products:</h4>
              {order.orderedProducts.map((item, idx) => (
              
                <div key={idx} className="flex items-center space-x-2 mt-2">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-14 rounded"
                  />
                  <p>
                    {item.product.name} (x{item.quantity}) - ₹
                    {item.product.price}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      order.orderStatus === "Cancelled"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    
                    Status: {order.orderStatus}
                  </p>
                </div>
              ))}
              {order.orderStatus === "Processing" && (
                <button
                  onClick={() => cancelOrder(order._id)}
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded"
                >
                  ❌ Cancel Order
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
