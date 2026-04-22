import { useEffect, useState } from "react";
import axios from "axios";

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const [editProduct, setEditProduct] = useState(null);

  const [editedData, setEditedData] = useState({
    name: "",
    price: "",
    category: "",
  });

  const [activeTab, setActiveTab] = useState("products");
  const [orders, setOrders] = useState([]);

  const vendorEmail = localStorage.getItem("email");

  // 🔥 Fetch Data
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [vendorEmail]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://multivendor-ti71.onrender.com/api/orders/vendor-orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Error fetching vendor orders:", error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `https://multivendor-ti71.onrender.com/api/orders/vendor-status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: res.data.order.orderStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `https://multivendor-ti71.onrender.com/api/products?vendor=${vendorEmail}`
      );
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // 🔥 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // 🔥 Upload Image
  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await axios.post(
      "https://multivendor-ti71.onrender.com/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return res.data.imageUrl;
  };

  // 🔥 Add Product
  const handleAddProduct = async () => {
    try {
      const imageUrl = await handleImageUpload();

      const finalProduct = {
        ...newProduct,
        images: [imageUrl],
        vendor: vendorEmail,
      };

      await axios.post(
        "https://multivendor-ti71.onrender.com/api/products",
        finalProduct,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Product added successfully!");

      setShowForm(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      });
      setImageFile(null);

      fetchProducts();
    } catch (err) {
      console.error("Add product error:", err);
    }
  };

  // 🔥 Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(
        `https://multivendor-ti71.onrender.com/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // 🔥 Edit Click
  const handleEditClick = (product) => {
    setEditProduct(product);
    setEditedData({
      name: product.name,
      price: product.price,
      category: product.category,
    });
  };

  // 🔥 Update Product
  const handleUpdateProduct = async () => {
    try {
      const res = await axios.put(
        `https://multivendor-ti71.onrender.com/api/products/${editProduct._id}`,
        editedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProducts((prev) =>
        prev.map((p) => (p._id === editProduct._id ? res.data : p))
      );

      setEditProduct(null);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Vendor Dashboard</h2>
      <p>Welcome, {vendorEmail}! Manage your dashboard below.</p>

      {/* 🔥 Tabs */}
      <div className="mt-4 mb-6 flex space-x-4 border-b pb-2">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "products" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
          }`}
        >
          My Products
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "orders" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
          }`}
        >
          My Orders
        </button>
      </div>

      {activeTab === "products" && (
        <>
          {/* 🔥 Add Product Button */}
          <button
        onClick={() => setShowForm(true)}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        ➕ Add Product
      </button>

      {/* 🔥 Add Product Form */}
      {showForm && (
        <div className="bg-white p-4 rounded shadow mt-4">
          <input
            name="name"
            placeholder="Name"
            value={newProduct.name}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newProduct.description}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          />
          <input
            name="price"
            placeholder="Price"
            value={newProduct.price}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          />
          <input
            name="category"
            placeholder="Category"
            value={newProduct.category}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          />
          <input
            name="stock"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          />

          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="mb-2"
          />

          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="w-32 h-32 object-cover mb-2"
            />
          )}

          <button
            onClick={handleAddProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Product
          </button>
        </div>
      )}

      {/* 🔥 Product List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {Array.isArray(products) &&
          products.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg shadow">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-32 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">
                {product.name}
              </h3>
              <p className="text-gray-600">₹{product.price}</p>

              {/* 🔥 Actions */}
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
        </>
      )}

      {/* 🔥 Orders Section */}
      {activeTab === "orders" && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Products</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border text-center">
                  <td className="border p-2">{order._id}</td>
                  <td className="border p-2 text-left">
                    {order.products.map((item, idx) => (
                      <div key={idx}>
                        • {item.product?.name} (x{item.quantity})
                      </div>
                    ))}
                  </td>
                  <td className="border p-2">₹{order.amount}</td>
                  <td className="border p-2">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      className="p-1 border rounded"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="mt-4 text-center text-gray-500">No orders found.</p>}
        </div>
      )}

      {/* 🔥 Edit Modal */}
      {editProduct && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>

            <input
              value={editedData.name}
              onChange={(e) =>
                setEditedData({ ...editedData, name: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />

            <input
              value={editedData.price}
              onChange={(e) =>
                setEditedData({ ...editedData, price: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />

            <input
              value={editedData.category}
              onChange={(e) =>
                setEditedData({ ...editedData, category: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />

            <div className="flex justify-end">
              <button
                onClick={() => setEditProduct(null)}
                className="bg-gray-500 text-white px-4 py-2 mr-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateProduct}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;


