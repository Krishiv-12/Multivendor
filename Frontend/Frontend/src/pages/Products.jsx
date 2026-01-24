import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BsFillSuitHeartFill } from "react-icons/bs";
import { toast } from "react-toastify";

const shimmer = `
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://multivendor-ti71.onrender.com/api/products?page=${page}&limit=9`
        );
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) &&
        (category ? product.category === category : true)
    );
  }, [products, search, category]);

const handleAddToWishlist = async (productId) => {
  try {
    await axios.post(
      "https://multivendor-ti71.onrender.com/api/wishlist/add",
      { productId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Added to wishlist");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to add to wishlist"
    );
  }
};

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <style>{shimmer}</style>

      <h2 className="text-4xl font-darker font-bold mb-6 text-gray-800 dark:text-white text-center">
        Explore Our Products
      </h2>

      {/* 🔍 Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8">
        <input
          type="text"
          placeholder="🔍 Search products..."
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 dark:text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="w-full md:w-1/4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 dark:text-black"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home & Kitchen">Home & Kitchen</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {/* 🛒 Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`shimmer-${i}`}
              className="bg-gray-200 rounded-lg h-96 animate-pulse relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(90deg, #e0e0e0 25%, #f2f2f2 50%, #e0e0e0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
              }}
            ></div>
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product, i) => (
            <motion.div
              key={`${product._id}-${i}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: "spring" }}
              className="bg-[#eeebeb] dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition duration-300 p-2 border border-gray-300"
            >
              <img
                src={
                  product.images[0]
                    ? product.images[0].replace(
                        "/upload/",
                        "/upload/w_400,h_400,c_fill,f_auto,q_auto/"
                      )
                    : "https://via.placeholder.com/400x400"
                }
                alt={product.name}
                className="h-72 w-full object-cover rounded-lg"
                loading="lazy"
              />
              <h3 className="text-2xl font-darker text-gray-800 dark:text-gray-200 mt-4 truncate">
                {product.name}
              </h3>
              <p className="text-xs font-semibold text-gray-500">
                ₹{product.price}
              </p>
              <div className="mt-3 flex gap-2">
                <Link to={`/product/${product._id}`} className="w-full">
                  <button className="w-full bg-black hover:bg-white hover:text-black text-white hover:border hover:border-gray-500 py-2 rounded-lg transition duration-300 ">
                    View Details
                  </button>
                </Link>
                <button
                  onClick={() => handleAddToWishlist(product._id)}
                  className="hover:text-red-500 text-xl bg-white hover:border hover:border-gray-500 px-4 py-2 rounded-lg border-2 transition-all duration-300"
                >
                  <BsFillSuitHeartFill />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-600 col-span-3 text-center">
            No products found.
          </p>
        )}
      </div>

      {/* ⏩ Pagination */}
      <div className="flex justify-center mt-10 gap-4 items-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          ← Prev
        </button>
        <span className="text-lg font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Products;
