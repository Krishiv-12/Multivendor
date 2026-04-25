import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../components/Toast";
import LazyImage from "../components/LazyImage";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastComponent } = useToast();

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
        showToast("Error fetching order history", "error");
      } finally {
        setLoading(false);
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

      showToast(data.message, "success");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: "Cancelled" }
            : order
        )
      );
    } catch (error) {
      showToast("Failed to cancel order.", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 dark:border-slate-700 dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 transition-colors duration-300">
      {ToastComponent}
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 card-enter">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
            My Account
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Order History
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-slate-700 card-enter">
            <div className="w-20 h-20 mx-auto bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No orders found</h3>
            <p className="text-gray-500 dark:text-gray-400">Looks like you haven't made any purchases yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 rounded-3xl p-6 sm:p-8 card-enter"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Total</p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        ₹{order.amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                        order.orderStatus === "Cancelled"
                          ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                          : order.orderStatus === "Processing"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                          : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Products */}
                <div className="border-t border-gray-100 dark:border-slate-700 pt-6 space-y-4">
                  {order.orderedProducts.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-5"
                    >
                      <div className="w-20 h-20 shrink-0">
                        <LazyImage
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full rounded-2xl object-cover bg-gray-50 dark:bg-slate-700"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                          Qty: {item.quantity} × ₹{item.product.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cancel Button */}
                {order.orderStatus === "Processing" && (
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl font-bold transition-colors text-sm"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;