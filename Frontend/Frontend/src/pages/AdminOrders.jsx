import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  // 🔄 Fetch all orders on mount
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("https://multivendor-ti71.onrender.com/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔧 Update Order Status
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `https://multivendor-ti71.onrender.com/api/orders/status/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Order status updated");
      fetchOrders(); // refresh after update
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">🛒 All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-300 rounded-md p-6 mb-6 shadow"
          >
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>User:</strong> {order.shippingInfo.name} ({order.shippingInfo.email})</p>
            <p><strong>Address:</strong> {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.zip}</p>
            <p><strong>Total Amount:</strong> ₹{order.amount}</p>
            <p><strong>Status:</strong> 
              <select
                value={order.orderStatus}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="ml-2 px-2 py-1 border rounded"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </p>
            <div className="mt-4">
              <strong>Products:</strong>
              <ul className="list-disc ml-6">
                {order.orderedProducts.map((item, idx) => (
                  <li key={idx}>
                    Product ID: {item.product}, Quantity: {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
