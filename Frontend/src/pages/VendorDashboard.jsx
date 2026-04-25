import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../components/Toast";
import LazyImage from "../components/LazyImage";

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { showToast, ToastComponent } = useToast();

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
  const [loading, setLoading] = useState(false);

  const vendorEmail = localStorage.getItem("email");

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
      showToast("Order status updated", "success");
    } catch (error) {
      showToast("Error updating order status", "error");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

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

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !imageFile) {
      showToast("Please provide name, price, and an image.", "error");
      return;
    }

    setLoading(true);
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

      showToast("Product added successfully!", "success");

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
      showToast("Failed to add product.", "error");
    } finally {
      setLoading(false);
    }
  };

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
      showToast("Product deleted.", "success");
    } catch (err) {
      showToast("Failed to delete product.", "error");
    }
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setEditedData({
      name: product.name,
      price: product.price,
      category: product.category,
    });
  };

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
      showToast("Product updated.", "success");
    } catch (err) {
      showToast("Failed to update product.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-10 px-4 transition-colors duration-300">
      {ToastComponent}
      <div className="max-w-6xl mx-auto card-enter">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Vendor Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Welcome, <span className="font-semibold text-gray-700 dark:text-gray-300">{vendorEmail}</span>! Manage your products and orders below.</p>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 dark:border-slate-700 mb-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${
              activeTab === "products" 
                ? "bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            My Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${
              activeTab === "orders" 
                ? "bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Vendor Orders
          </button>
        </div>

        {activeTab === "products" && (
          <div className="card-enter">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors mb-6 flex items-center gap-2 text-sm"
            >
              {showForm ? "Cancel Adding" : "➕ Add New Product"}
            </button>

            {/* Add Product Form */}
            {showForm && (
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 mb-8 card-enter">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create New Product</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Name</label>
                    <input
                      name="name"
                      placeholder="E.g., Wireless Headphones"
                      value={newProduct.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                    <input
                      name="category"
                      placeholder="E.g., Electronics"
                      value={newProduct.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                    <textarea
                      name="description"
                      placeholder="Detailed product description..."
                      value={newProduct.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400 min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price (₹)</label>
                    <input
                      name="price"
                      type="number"
                      placeholder="0.00"
                      value={newProduct.price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Stock Quantity</label>
                    <input
                      name="stock"
                      type="number"
                      placeholder="100"
                      value={newProduct.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Image</label>
                    <input
                      type="file"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-200 dark:file:bg-slate-700 file:text-gray-700 dark:file:text-white hover:file:bg-gray-300 dark:hover:file:bg-slate-600 transition-all"
                    />
                    {imageFile && (
                      <div className="mt-4">
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-xl shadow-sm border border-gray-200 dark:border-slate-700"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddProduct}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm disabled:opacity-50"
                  >
                    {loading ? "Uploading..." : "Save Product"}
                  </button>
                </div>
              </div>
            )}

            {/* Product List */}
            {products.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
                <p className="text-gray-500 dark:text-gray-400">You haven't added any products yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="h-48 bg-gray-100 dark:bg-slate-700 relative group overflow-hidden">
                      <LazyImage
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{product.category}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">₹{product.price?.toLocaleString("en-IN")}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Section */}
        {activeTab === "orders" && (
          <div className="card-enter">
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
                <p className="text-gray-500 dark:text-gray-400">No orders to display.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Order ID</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Products</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-xs text-right">Amount</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-slate-900/20 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{order._id.slice(-8)}</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                            <div className="space-y-1">
                              {order.products.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-slate-600"></span>
                                  <span className="truncate max-w-[200px]">{item.product?.name}</span>
                                  <span className="text-gray-400 text-xs">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-right">₹{order.amount?.toLocaleString("en-IN")}</td>
                          <td className="px-6 py-4">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className="px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all cursor-pointer"
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
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {editProduct && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900/50 backdrop-blur-sm p-4 card-enter">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h2>
                <button onClick={() => setEditProduct(null)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Name</label>
                  <input
                    value={editedData.name}
                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price (₹)</label>
                  <input
                    type="number"
                    value={editedData.price}
                    onChange={(e) => setEditedData({ ...editedData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                  <input
                    value={editedData.category}
                    onChange={(e) => setEditedData({ ...editedData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditProduct(null)}
                  className="px-5 py-2.5 rounded-xl font-bold bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProduct}
                  className="px-5 py-2.5 rounded-xl font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;


