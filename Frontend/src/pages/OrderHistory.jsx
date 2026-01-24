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

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: "Cancelled" }
            : order
        )
      );
    } catch (error) {
      alert("Failed to cancel order.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-4xl  font-darker font-semibold mb-8 text-gray-800 dark:text-white">
        Order History
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-6"
            >
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {order._id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.orderStatus === "Cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {order.orderStatus}
                  </span>

                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    ₹{order.amount}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div className="border-t dark:border-slate-700 pt-4 space-y-4">
                {order.orderedProducts.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />

                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ₹{item.product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cancel Button */}
              {order.orderStatus === "Processing" && (
                <button
                  onClick={() => cancelOrder(order._id)}
                  className="mt-5 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
