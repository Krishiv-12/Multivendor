import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BsFillSuitHeartFill } from "react-icons/bs";
import LazyImage from "../components/LazyImage";
import { useToast } from "../components/Toast";

const SkeletonCard = ({ delay = 0 }) => (
  <div
    className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm card-enter"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="h-72 w-full animate-pulse bg-gray-200 dark:bg-slate-700 shimmer-bg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700" />
    <div className="p-5 space-y-3">
      <div className="h-5 w-3/4 rounded-lg animate-pulse bg-gray-200 dark:bg-slate-700" />
      <div className="h-4 w-1/3 rounded-lg animate-pulse bg-gray-200 dark:bg-slate-700" />
      <div className="flex gap-3 pt-3">
        <div className="flex-1 h-11 rounded-xl animate-pulse bg-gray-200 dark:bg-slate-700" />
        <div className="w-14 h-11 rounded-xl animate-pulse bg-gray-200 dark:bg-slate-700" />
      </div>
    </div>
  </div>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const { showToast, ToastComponent } = useToast();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://multivendor-ti71.onrender.com/api/products?page=${page}&limit=8`
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
    if (!token) {
      showToast("Please login to add to wishlist", "error");
      return;
    }
    try {
      await axios.post(
        "https://multivendor-ti71.onrender.com/api/wishlist/add",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Added to wishlist!", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Error adding to wishlist", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 py-10">
      {ToastComponent}
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 card-enter">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-1 text-center md:text-left">
            Catalog
          </p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight text-center md:text-left">
            Explore Our Products
          </h2>
        </div>

        {/* 🔍 Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8 card-enter" style={{ animationDelay: "100ms" }}>
          <div className="relative w-full md:w-1/2">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-shadow shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="relative w-full md:w-1/4">
            <select
              className="w-full appearance-none px-4 py-3.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white transition-shadow shadow-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Accessories">Accessories</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 🛒 Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={`shimmer-${i}`} delay={i * 70} />
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product, i) => (
              <div
                key={product._id}
                className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 card-enter flex flex-col"
                style={{ animationDelay: `${i * 65}ms` }}
              >
                <div className="relative h-72 w-full bg-gray-50 dark:bg-slate-700 overflow-hidden">
                  <LazyImage src={product.images} alt={product.name} />
                  
                  <button
                    onClick={() => handleAddToWishlist(product._id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 text-gray-400"
                    title="Add to Wishlist"
                  >
                    <BsFillSuitHeartFill className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug mb-1">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </p>
                  
                  <div className="mt-auto pt-2">
                    <Link to={`/product/${product._id}`} className="block w-full">
                      <button className="w-full py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center card-enter">
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-5">
                 <svg className="w-9 h-9 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No products found
              </h3>
              <p className="text-gray-400 dark:text-gray-500">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>

        {/* ⏩ Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-3 items-center card-enter" style={{ animationDelay: "300ms" }}>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-4">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
