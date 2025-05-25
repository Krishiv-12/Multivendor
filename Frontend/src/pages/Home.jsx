import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products?page=1&limit=9");
        setProducts(res.data.products);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="text-center">
      {/* Hero Section */}
      <div
  className="bg-cover bg-center text-white mt-4 py-20"
  style={{
    backgroundImage: `url('https://images.unsplash.com/photo-1729420478052-0264c4a72b1b?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
  }}
>
  <h1 className="text-4xl font-bold">
    Welcome to MultiVendor Marketplace
  </h1>
  <p className="mt-2 text-lg">
    Find the best products from various vendors
  </p>
  <Link to="/shop">
    <button className="mt-6 px-6 py-3 bg-white text-blue-700 font-semibold rounded-full hover:bg-blue-100 transition">
              🛍️ Shop Now
            </button>
  </Link>
</div>


      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
          ✨ Latest Products
        </h2>

        {!loading && products.length === 0 && <p>No products found</p>}

        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border flex flex-col items-center h-96 w-72 p-4 rounded-lg shadow">
              <img
  src={Array.isArray(product.images) ? product.images[0] : product.images}
  alt={product.name}
  className="w-64 h-64 object-cover rounded"
/>

              <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">Price: ₹{product.price}</p>
              <Link
                to={`/product/${product._id}`}
                className="bg-blue-600 mt-2 text-white px-4 py-1 rounded-full"
              >
                Buy Now
              </Link>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default Home;
