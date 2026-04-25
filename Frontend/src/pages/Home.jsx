import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LazyImage from "../components/LazyImage";

/* ---------------- Premium Product Card ---------------- */
const ProductCard = ({ product, index }) => (
  <motion.div
    className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-100 dark:border-slate-700/50 transition-all duration-500 flex flex-col w-full group relative"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
  >
    {/* Image Container with Floating Elements */}
    <div className="h-64 sm:h-72 bg-gray-50 dark:bg-slate-900/50 relative overflow-hidden p-3">
      {/* Category Badge */}
      <div className="absolute top-5 left-5 z-20">
        <span className="px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-200 dark:border-slate-700 rounded-full text-xs font-bold tracking-wide text-gray-800 dark:text-gray-200 shadow-sm">
          {product.category || "Premium"}
        </span>
      </div>

      <div className="w-full h-full rounded-2xl overflow-hidden relative">
        <LazyImage
          src={product.images?.[0] || product.images}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        {/* Subtle Dark Gradient Overlay for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>

    {/* Content Section */}
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-3 gap-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">
          {product.name}
        </h3>
        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 mb-0.5">Price</p>
          <span className="text-xl font-black text-gray-900 dark:text-white">
            ₹{product.price?.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
      
      <div className="mt-auto pt-6">
        <Link
          to={`/product/${product._id}`}
          className="flex items-center justify-center gap-2 w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3.5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md group-hover:shadow-lg"
        >
          <span>View Details</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </div>
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
        `https://multivendor-ti71.onrender.com/api/products?page=${page}&limit=8`,
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 font-sans selection:bg-gray-900 selection:text-white dark:selection:bg-white dark:selection:text-gray-900">
      
      {/* ---------------- Premium Hero Section ---------------- */}
      <div className="relative overflow-hidden pt-24 pb-32 border-b border-gray-100 dark:border-slate-800">
        
        {/* Modern Grid Background */}
        <div className="absolute inset-0 -z-20 h-full w-full bg-white dark:bg-slate-950 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Fade Out Grid at Bottom */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-white via-transparent to-transparent dark:from-slate-900"></div>

        {/* Animated Glowing Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob"></div>
          <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">The Next Generation Marketplace</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white mb-6 leading-[1.1]">
              Elevate Your Shopping <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-900 dark:from-gray-400 dark:to-white">Experience.</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Discover a curated collection of premium products from top-tier vendors globally. ShopVerse brings you unmatched quality, secure transactions, and a seamless journey from cart to doorstep.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/shop">
                <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                  <span>Start Exploring</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </Link>
              <a href="#featured" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-bold text-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300">
                View Latest Deals
              </a>
            </div>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 pt-10 border-t border-gray-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { title: "Premium Quality", desc: "Curated vendors only", icon: "💎" },
              { title: "Fast Delivery", desc: "Global shipping network", icon: "🚀" },
              { title: "Secure Payments", desc: "End-to-end encryption", icon: "🛡️" },
              { title: "24/7 Support", desc: "Always here to help", icon: "🎧" }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <span className="text-3xl mb-3">{feature.icon}</span>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ---------------- Products Section ---------------- */}
      <div id="featured" className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Handpicked items from our most trusted vendors, updated daily to bring you the best value.
            </p>
          </div>
          <Link to="/shop" className="text-gray-900 dark:text-white font-bold hover:underline underline-offset-4 flex items-center gap-1">
            View All Products <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-center font-medium mb-8 border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}
        
        {!loading && products.length === 0 && !error && (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
            <p className="text-xl text-gray-500 dark:text-gray-400">Our marketplace is currently restocking. Check back soon!</p>
          </div>
        )}

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>

        {loading && (
          <div className="mt-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 dark:border-slate-700 dark:border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && hasMore && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-8 py-3 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-bold border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
            >
              Load More Products
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
