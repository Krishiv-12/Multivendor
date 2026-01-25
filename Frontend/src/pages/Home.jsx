import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ---------------- Product Card ---------------- */
const ProductCard = ({ product, index }) => (
  <motion.div
    className="w-full max-w-sm bg-[#eeebeb] rounded-xl shadow-md hover:shadow-xl transition duration-300 p-3 flex flex-col items-center"
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
              "/upload/w_400,h_400,c_fill,f_auto,q_auto/",
            )
          : product.images.replace(
              "/upload/",
              "/upload/w_400,h_400,c_fill,f_auto,q_auto/",
            )
      }
      alt={product.name}
      className="w-full h-48 sm:h-56 object-cover rounded-lg"
    />

    <h3 className="mt-1 sm:text-2xl font-darker text-gray-800 text-center">
      {product.name}
    </h3>

    <div className="flex flex-wrap gap-4 items-center justify-center mt-4">
      <p className="bg-gray-200 border border-gray-400 rounded text-sm px-4 dark:text-black py-2 cursor-default">
        ₹{product.price}
      </p>

      <Link
        to={`/product/${product._id}`}
        className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-200 hover:text-black hover:border hover:border-gray-500 transition"
      >
        Buy Now
      </Link>
    </div>
  </motion.div>
);

/* ---------------- Home Page ---------------- */
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
        `https://multivendor-ti71.onrender.com/api/products?page=${page}&limit=6`,
      );

      setProducts((prev) => {
        const merged = [...prev, ...res.data.products];
        return Array.from(new Map(merged.map((p) => [p._id, p])).values());
      });

      setHasMore(res.data.products.length > 0);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page]);

  return (
    <div className="bg-f text-center">
      {/* ---------------- Hero Section ---------------- */}
      <div
        className="bg-cover bg-center text-white px-4 py-32 sm:py-44 md:py-56"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
            url('https://images.unsplash.com/photo-1654765437278-9f356466acdb?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&quot')
          `,
        }}
      >
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bartle drop-shadow">
          Welcome to <br /> <span className="text-yellow-500">ShopVerse</span>{" "}
          <br /> Marketplace
        </h1>

        <p className="mt-4 text-base sm:text-lg md:text-2xl font-quicksand drop-shadow">
          Find the best products from various vendors
        </p>

        <Link to="/shop">
          <button
            className="
    group relative overflow-hidden mt-8 px-8 py-3
    rounded-xl border border-[#5d5b49]
    bg-[#F4F3E9] text-[#5d5b49]
    font-reem font-semibold

    transition-all duration-500 ease-out
    hover:-translate-y-0.5
    hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]
    active:translate-y-0
  "
          >
            <span
              className="
      relative z-10
      transition-colors duration-500 ease-out
      group-hover:text-[#F4F3E9]
    "
            >
              🛍️ Shop Now
            </span>

            <span
              className="
      absolute inset-0
      bg-yellow-500
      scale-x-0 origin-left
      transition-transform duration-500 ease-out
      group-hover:scale-x-100
    "
            />
          </button>
        </Link>
      </div>

      {/* ---------------- Products Section ---------------- */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-darker font-semibold mb-10 text-gray-800 dark:text-white">
          Latest Products
        </h2>

        {error && <p className="text-red-500">{error}</p>}
        {!loading && products.length === 0 && <p>No products found.</p>}

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center">
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
            className=" mt-8 px-6 py-2 rounded-xl
    bg-white text-black font-reem font-semibold
    border border-gray-300
    transition-all duration-300
    hover:bg-yellow-500 hover:text-white
    hover:shadow-[0_0_25px_rgba(0,0,0,0.35)]
    hover:-translate-y-1
    active:translate-y-0"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
