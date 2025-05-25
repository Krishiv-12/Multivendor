import { useEffect, useState } from "react";
import axios from "axios";

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const vendorEmail = localStorage.getItem("email"); // Vendor ke email se filter karenge

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products?vendor=${vendorEmail}`);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [vendorEmail]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Vendor Dashboard</h2>
      <p>Welcome, {vendorEmail}! Manage your products below.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg shadow">
            <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded" />
            <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorDashboard;
