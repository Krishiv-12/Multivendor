import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ProductCard = ({ product, index }) => (
  <motion.div
    key={product._id}
    className="border bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 w-72 p-4 flex flex-col items-center"
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.4 }}
  >
    <img
    loading="lazy"
      src={
        Array.isArray(product.images)
          ? product.images[0].replace(
              "/upload/",
              "/upload/w_400,h_400,c_fill,f_auto,q_auto/"
            )
          : product.images.replace(
              "/upload/",
              "/upload/w_400,h_400,c_fill,f_auto,q_auto/"
            )
      }
      alt={product.name}
      className="w-60 h-60 object-cover rounded-lg"
    />

    <h3 className="text-lg font-semibold mt-4 text-gray-800">{product.name}</h3>
    <p className="text-gray-600 mt-1">₹{product.price}</p>
    <Link
      to={`/product/${product._id}`}
      className="bg-blue-600 hover:bg-blue-700 text-white text-sm mt-4 px-4 py-2 rounded-full transition"
    >
      Buy Now
    </Link>
  </motion.div>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://multivendor-ti71.onrender.com/api/products?page=${page}&limit=6`
      );

      setProducts((prev) => {
        const allProducts = [...prev, ...res.data.products];
        const uniqueProducts = Array.from(
          new Map(allProducts.map((p) => [p._id, p])).values()
        );
        return uniqueProducts;
      });

      setHasMore(res.data.products.length > 0);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page]);

  return (
    <div className="text-center">
      {/* Hero Section */}
      <div
        className="bg-cover bg-center text-white py-24 px-4"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1729420478052-0264c4a72b1b?q=80&w=2030&auto=format&fit=crop')`,
        }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold drop-shadow">
          Welcome to MultiVendor Marketplace
        </h1>
        <p className="mt-3 text-lg sm:text-xl drop-shadow">
          Find the best products from various vendors
        </p>
        <Link to="/shop">
          <button className="mt-6 px-6 py-3 bg-white text-blue-700 font-semibold rounded-full hover:bg-blue-100 transition duration-300">
            🛍️ Shop Now
          </button>
        </Link>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
          ✨ Latest Products
        </h2>

        {error && <p className="text-red-500">{error}</p>}
        {!loading && products.length === 0 && <p>No products found.</p>}

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>

        {loading && (
          <p className="mt-6 text-gray-500">Loading more products...</p>
        )}

        {!loading && hasMore && (
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="mt-8 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
