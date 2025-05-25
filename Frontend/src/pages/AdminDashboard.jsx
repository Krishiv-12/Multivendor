import { useEffect, useState } from "react";
import axios from "axios";
import AnalyticsChart from "./AnalyticsChart";


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
        const res = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };
    fetchData();
  }, []);

  // Function to fetch details when clicking on a box
  const fetchDetails = async (type) => {
    let url = "";
    if (type === "users") url = "http://localhost:5000/api/admin/users";
    if (type === "products") url = "http://localhost:5000/api/admin/products";
    if (type === "orders") url = "http://localhost:5000/api/admin/orders";
    if (type === "vendors") url = "http://localhost:5000/api/admin/vendors";

    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setData(res.data);
      setActiveSection(type);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  const handleBanUnban = async (userId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/ban`,
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
    } catch (error) {
      console.error("Error updating user ban status:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setData((prevData) => prevData.filter((item) => item._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
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
        `http://localhost:5000/api/admin/products/${editProduct._id}`,
        editedData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setData((prevData) =>
        prevData.map((item) => (item._id === editProduct._id ? res.data : item))
      );

      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
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
  
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
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
    try {
      const imageUrl = await handleImageUpload();
      const finalProduct = { ...newProduct, images: [imageUrl] };
  
      await axios.post("http://localhost:5000/api/admin/products", finalProduct, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      alert("Product added successfully!");
      setNewProduct({ name: "", description: "", price: "", category: "", stock: 0, images: [] });
      setImageFile(null);
    } catch (err) {
      console.error("Add Product Error:", err);
    }
  };
  return (
    <div className="p-4 sm:p-6 overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {stats.users && <AnalyticsChart stats={stats} />}

      <button
        onClick={() => setShowAddForm(true)}
        className="mt-4 mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        ➕ Add New Product
      </button>
      {showAddForm && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={handleNewProductChange}
              className="w-full border p-2 mb-2"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newProduct.description}
              onChange={handleNewProductChange}
              className="w-full border p-2 mb-2"
            ></textarea>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newProduct.price}
              onChange={handleNewProductChange}
              className="w-full border p-2 mb-2"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={newProduct.category}
              onChange={handleNewProductChange}
              className="w-full border p-2 mb-2"
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={handleNewProductChange}
              className="w-full border p-2 mb-2"
            />
            <input
  type="file"
  accept="image/*"
  onChange={(e) => setImageFile(e.target.files[0])}
  className="border p-2 w-full mb-2"
/>

{imageFile && (
  <img
    src={URL.createObjectURL(imageFile)}
    alt="Preview"
    className="w-32 h-auto mb-2 rounded"
  />
)}


            <div className="flex justify-end">
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="bg-blue-500 text-white p-6 rounded-lg cursor-pointer"
          onClick={() => fetchDetails("users")}
        >
          <h2 className="text-xl font-bold">Total Users</h2>
          <p>{stats.users}</p>
        </div>
        <div
          className="bg-green-500 text-white p-6 rounded-lg cursor-pointer"
          onClick={() => fetchDetails("products")}
        >
          <h2 className="text-xl font-bold">Total Products</h2>
          <p>{stats.products}</p>
        </div>
        <div
          className="bg-yellow-500 text-white p-6 rounded-lg cursor-pointer"
          onClick={() => fetchDetails("orders")}
        >
          <h2 className="text-xl font-bold">Total Orders</h2>
          <p>{stats.orders}</p>
        </div>
        <div
          className="bg-red-500 text-white p-6 rounded-lg cursor-pointer"
          onClick={() => fetchDetails("vendors")}
        >
          <h2 className="text-xl font-bold">Total Vendors</h2>
          <p>{stats.vendors}</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="mt-6">
        {activeSection && (
          <div className="overflow-x-auto">
            <h2 className="text-xl font-bold mb-2">
              {activeSection === "users" && "All Users"}
              {activeSection === "products" && "All Products"}
              {activeSection === "orders" && "All Orders"}
              {activeSection === "vendors" && "All Vendors"}
            </h2>
            <table className="min-w-full bg-blue-500 border border-gray-500">
              <thead>
                <tr className="bg-blue-500">
                  {activeSection === "users" && (
                    <>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Email</th>
                      <th className="border p-2">Role</th>
                      <th className="border p-2">Actions</th>
                    </>
                  )}
                  {activeSection === "products" && (
                    <>
                      <th className="border p-2">Product Name</th>
                      <th className="border p-2">Price</th>
                      <th className="border p-2">Category</th>
                      <th className="border p-2">Actions</th>
                    </>
                  )}
                  {activeSection === "orders" && (
                    <>
                      <th className="border p-2">Order ID</th>
                      <th className="border p-2">Total Amount</th>
                      <th className="border p-2">Status</th>
                    </>
                  )}
                  {activeSection === "vendors" && (
                    <>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Email</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border">
                    {activeSection === "users" && (
                      <>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2">{item.email}</td>
                        <td className="border p-2">{item.role}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => handleBanUnban(item._id)}
                            className={`px-3 py-1 rounded text-white ${
                              item.isBanned ? "bg-red-500" : "bg-green-500"
                            }`}
                          >
                            {item.isBanned ? "Unban" : "Ban"}
                          </button>
                        </td>
                      </>
                    )}
                    {activeSection === "products" && (
                      <>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2">₹{item.price}</td>
                        <td className="border p-2">{item.category}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => handleDeleteProduct(item._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                          <button
                            className="bg-yellow-500 text-white px-3 ml-4 py-1 rounded"
                            onClick={() => handleEditClick(item)}
                          >
                            Edit
                          </button>
                        </td>
                        <td></td>
                      </>
                    )}
                    {activeSection === "orders" && (
                      <>
                        <td className="border p-2">{item._id}</td>
                        <td className="border p-2">${item.amount}</td>
                        <td className="border p-2">{item.orderStatus}</td>
                      </>
                    )}
                    {activeSection === "vendors" && (
                      <>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2">{item.email}</td>
                        <td className="border p-2"></td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editProduct && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-black mb-4">Edit Product</h2>
            <input
              type="text"
              className="border p-2 w-full mb-2 text-black"
              value={editedData.name}
              onChange={(e) =>
                setEditedData({ ...editedData, name: e.target.value })
              }
            />
            <input
              type="text"
              className="border p-2 w-full mb-2 text-black"
              value={editedData.price}
              onChange={(e) =>
                setEditedData({ ...editedData, price: e.target.value })
              }
            />
            <input
              type="text"
              className="border p-2 w-full mb-2 text-black"
              value={editedData.category}
              onChange={(e) =>
                setEditedData({ ...editedData, category: e.target.value })
              }
            />
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setEditProduct(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleUpdateProduct}
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

export default AdminDashboard;
