import { useEffect, useState } from "react";
import axios from "axios";
import AnalyticsChart from "./AnalyticsChart";
import { useToast } from "../components/Toast";
import LazyImage from "../components/LazyImage";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [activeSection, setActiveSection] = useState("");
  const [data, setData] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [editedData, setEditedData] = useState({
    name: "",
    price: "",
    category: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [],
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://multivendor-ti71.onrender.com/api/admin/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setStats(res.data);
      } catch (error) {
        showToast("Error fetching admin stats", "error");
      }
    };
    fetchData();
  }, []);

  const fetchDetails = async (type) => {
    let url = "";
    if (type === "users") url = "https://multivendor-ti71.onrender.com/api/admin/users";
    if (type === "products") url = "https://multivendor-ti71.onrender.com/api/admin/products";
    if (type === "orders") url = "https://multivendor-ti71.onrender.com/api/admin/orders";
    if (type === "vendors") url = "https://multivendor-ti71.onrender.com/api/admin/vendors";

    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (type === "orders") {
        setData(res.data.orders || []);
      } else {
        setData(res.data);
      }
      setActiveSection(type);
    } catch (error) {
      showToast(`Error fetching ${type}`, "error");
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `https://multivendor-ti71.onrender.com/api/orders/admin/order/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setData((prevData) =>
        prevData.map((order) =>
          order._id === orderId ? { ...order, orderStatus: res.data.order.orderStatus } : order
        )
      );
      showToast("Order status updated", "success");
    } catch (error) {
      showToast("Error updating order status", "error");
    }
  };

  const handleBanUnban = async (userId) => {
    try {
      await axios.put(
        `https://multivendor-ti71.onrender.com/api/admin/users/${userId}/ban`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setData((prevData) =>
        prevData.map((user) =>
          user._id === userId ? { ...user, isBanned: !user.isBanned } : user
        )
      );
      showToast("User status updated", "success");
    } catch (error) {
      showToast("Error updating user status", "error");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(
        `https://multivendor-ti71.onrender.com/api/admin/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setData((prevData) => prevData.filter((item) => item._id !== productId));
      showToast("Product deleted successfully", "success");
    } catch (error) {
      showToast("Error deleting product", "error");
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
        `https://multivendor-ti71.onrender.com/api/admin/products/${editProduct._id}`,
        editedData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setData((prevData) =>
        prevData.map((item) => (item._id === editProduct._id ? res.data : item))
      );

      setEditProduct(null);
      showToast("Product updated successfully", "success");
    } catch (error) {
      showToast("Error updating product", "error");
    }
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
  
      const res = await axios.post("https://multivendor-ti71.onrender.com/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      return res.data.imageUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Image upload failed");
    }
  };
  
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !imageFile) {
      showToast("Please provide name, price, and an image.", "error");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await handleImageUpload();
      const finalProduct = { ...newProduct, images: [imageUrl] };
  
      await axios.post("https://multivendor-ti71.onrender.com/api/admin/products", finalProduct, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      showToast("Product added successfully!", "success");
      setNewProduct({ name: "", description: "", price: "", category: "", stock: 0, images: [] });
      setImageFile(null);
      setShowAddForm(false);
      if (activeSection === "products") {
        fetchDetails("products");
      }
    } catch (err) {
      showToast("Add Product Error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {ToastComponent}
      <div className="max-w-7xl mx-auto space-y-8 card-enter">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Platform overview and management.</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            ➕ Add New Product
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: "users", label: "Total Users", value: stats.users, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-900/50" },
            { id: "products", label: "Total Products", value: stats.products, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50" },
            { id: "orders", label: "Total Orders", value: stats.orders, color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-900/50" },
            { id: "vendors", label: "Total Vendors", value: stats.vendors, color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/50" },
          ].map((stat) => (
            <div
              key={stat.id}
              onClick={() => fetchDetails(stat.id)}
              className={`p-6 rounded-3xl border cursor-pointer hover:shadow-md transition-all ${stat.color} ${activeSection === stat.id ? 'ring-2 ring-current ring-offset-2 dark:ring-offset-slate-900' : ''}`}
            >
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">{stat.label}</h2>
              <p className="text-4xl font-black">{stat.value || 0}</p>
            </div>
          ))}
        </div>

        {stats.users && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <AnalyticsChart stats={stats} />
          </div>
        )}

        {/* Details Section */}
        {activeSection && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden card-enter">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                Manage {activeSection}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    {activeSection === "users" && (
                      <>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Email</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Role</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Status</th>
                      </>
                    )}

                    {activeSection === "orders" && (
                      <>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Order ID</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Products</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-xs text-right">Amount</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Status</th>
                      </>
                    )}
                    {activeSection === "vendors" && (
                      <>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Email</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {activeSection !== "products" && data.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-slate-900/20 transition-colors">
                      {activeSection === "users" && (
                        <>
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.email}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                              {item.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleBanUnban(item._id)}
                              className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                                item.isBanned 
                                  ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40" 
                                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                              }`}
                            >
                              {item.isBanned ? "Banned (Unban)" : "Active (Ban)"}
                            </button>
                          </td>
                        </>
                      )}
                      {activeSection === "products" && (
                        <>
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            <div className="flex items-center gap-3">
                              {item.images?.[0] && (
                                <LazyImage src={item.images[0]} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-slate-700" />
                              )}
                              <span className="truncate max-w-[200px]">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">₹{item.price?.toLocaleString("en-IN")}</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.category}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(item)}
                                className="p-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(item._id)}
                                className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                      {activeSection === "orders" && (
                        <>
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{item._id.slice(-8)}</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                            <div className="space-y-1">
                              {item.orderedProducts?.map((pItem, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-slate-600"></span>
                                  <span className="truncate max-w-[200px]">{pItem.product?.name}</span>
                                  <span className="text-gray-400 text-xs">x{pItem.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-right">₹{item.amount?.toLocaleString("en-IN")}</td>
                          <td className="px-6 py-4">
                            <select
                              value={item.orderStatus}
                              onChange={(e) => handleOrderStatusUpdate(item._id, e.target.value)}
                              className="px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all cursor-pointer"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </>
                      )}
                      {activeSection === "vendors" && (
                        <>
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.email}</td>
                        </>
                      )}
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No {activeSection} found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Product Cards Grid instead of Table */}
            {activeSection === "products" && data.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 bg-gray-50 dark:bg-slate-900/20">
                {data.map((product) => (
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

      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900/50 backdrop-blur-sm p-4 card-enter">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-2xl border border-gray-100 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product</h2>
              <button onClick={() => setShowAddForm(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Name</label>
                <input
                  name="name"
                  value={newProduct.name}
                  onChange={handleNewProductChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                <input
                  name="category"
                  value={newProduct.category}
                  onChange={handleNewProductChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleNewProductChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all min-h-[100px]"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleNewProductChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleNewProductChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
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
                onClick={() => setShowAddForm(false)}
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
  );
};

export default AdminDashboard;
