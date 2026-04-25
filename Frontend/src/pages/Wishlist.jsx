import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

// ── Cloudinary optimizer ─────────────────────────────────────────────────────
const cloudinaryOptimize = (url, width = 400) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},dpr_auto/`);
};

// ── Lazy image with shimmer + fade-in ────────────────────────────────────────
const LazyImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.05, rootMargin: "150px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const optimizedSrc = cloudinaryOptimize(Array.isArray(src) ? src[0] : src, 400);

  return (
    <div ref={ref} className="relative w-full h-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 shimmer-bg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700" />
      )}
      {inView && (
        <img
          src={optimizedSrc}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-contain transition-all duration-500 ${
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />
      )}
    </div>
  );
};

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = ({ delay = 0 }) => (
  <div
    className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm card-enter"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="h-56 w-full animate-pulse bg-gray-200 dark:bg-slate-700 shimmer-bg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700" />
    <div className="p-5 space-y-3">
      <div className="h-4 w-3/4 rounded-lg animate-pulse bg-gray-200 dark:bg-slate-700" />
      <div className="h-3 w-1/3 rounded-lg animate-pulse bg-gray-200 dark:bg-slate-700" />
      <div className="flex gap-3 pt-2">
        <div className="flex-1 h-10 rounded-xl animate-pulse bg-gray-200 dark:bg-slate-700" />
        <div className="w-20 h-10 rounded-xl animate-pulse bg-gray-200 dark:bg-slate-700" />
      </div>
    </div>
  </div>
);

// ── Toast notification ────────────────────────────────────────────────────────
const Toast = ({ message, type, visible }) => (
  <div
    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-lg text-sm font-medium transition-all duration-300 ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
    } ${
      type === "success"
        ? "bg-emerald-500 text-white"
        : "bg-red-500 text-white"
    }`}
  >
    {type === "success" ? (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    )}
    {message}
  </div>
);

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-28 text-center col-span-full card-enter">
    <div className="w-20 h-20 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center mb-5">
      <svg className="w-9 h-9 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
      Your wishlist is empty
    </h3>
    <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs">
      Save items you love and they'll show up here.
    </p>
  </div>
);

// ── Wishlist card ─────────────────────────────────────────────────────────────
const WishlistCard = ({ item, onRemove, onAddToCart, removing, animDelay }) => {
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(item.product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div
      className={`group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 card-enter ${
        removing ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{ animationDelay: `${animDelay}ms`, transition: "opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease" }}
    >
      {/* Image */}
      <div className="relative h-56 w-full bg-gray-50 dark:bg-slate-700 overflow-hidden">
        <LazyImage src={item.product.images} alt={item.product.name} />

        {/* Remove button — top right on hover */}
        <button
          onClick={() => onRemove(item._id)}
          disabled={removing}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 disabled:cursor-not-allowed"
          title="Remove from wishlist"
        >
          {removing ? (
            <svg className="w-4 h-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 mb-1 leading-snug">
          {item.product.name}
        </h3>
        <p className="text-base font-bold text-gray-900 dark:text-white mb-4">
          ₹{item.product.price?.toLocaleString("en-IN")}
        </p>

        <div className="flex gap-2.5">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              addedToCart
                ? "bg-emerald-500 text-white"
                : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100"
            }`}
          >
            {addedToCart ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Added!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </>
            )}
          </button>

          <button
            onClick={() => onRemove(item._id)}
            disabled={removing}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove"
          >
            {removing ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState(new Set());
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const token = localStorage.getItem("token");
  const { addToCart } = useCart();

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  };

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://multivendor-ti71.onrender.com/api/wishlist",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlistItems(res.data);
    } catch {
      showToast("Failed to load wishlist.", "error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleRemove = async (id) => {
    const previous = [...wishlistItems];
    setRemovingIds((prev) => new Set(prev).add(id));

    // Optimistic: animate out then remove
    setTimeout(() => {
      setWishlistItems((prev) => prev.filter((item) => item._id !== id));
      setRemovingIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }, 280);

    try {
      await axios.delete(
        `https://multivendor-ti71.onrender.com/api/wishlist/remove/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {
      setWishlistItems(previous);
      setRemovingIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
      showToast("Failed to remove item.", "error");
    }
  };

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    showToast(`${product.name?.split(" ").slice(0, 3).join(" ")} added to cart!`, "success");
  };

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .card-enter { animation: fadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .shimmer-bg { background-size: 200% 100%; animation: shimmer 1.6s infinite linear; }
      `}</style>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />

      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-10">

          {/* Header */}
          <div className="mb-8 card-enter">
            <p className="text-[10px] font-bold uppercase tracking-widest text-pink-500 dark:text-pink-400 mb-1">
              Account
            </p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              My Wishlist
            </h1>
            {!loading && wishlistItems.length > 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {wishlistItems.length} saved item{wishlistItems.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} delay={i * 70} />
              ))
            ) : wishlistItems.length === 0 ? (
              <EmptyState />
            ) : (
              wishlistItems.map((item, idx) => (
                <WishlistCard
                  key={item._id}
                  item={item}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                  removing={removingIds.has(item._id)}
                  animDelay={idx * 65}
                />
              ))
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Wishlist;