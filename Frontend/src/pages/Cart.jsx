import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

// ── Cloudinary optimizer ─────────────────────────────────────────────────────
const cloudinaryOptimize = (url, width = 160) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},dpr_auto/`);
};

// ── Lazy image ────────────────────────────────────────────────────────────────
const LazyImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: "120px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const optimized = cloudinaryOptimize(Array.isArray(src) ? src[0] : src, 160);

  return (
    <div ref={ref} className={`relative overflow-hidden bg-gray-100 dark:bg-slate-700 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 shimmer-bg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700" />
      )}
      {inView && (
        <img
          src={optimized}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
        />
      )}
    </div>
  );
};

// ── Quantity stepper ──────────────────────────────────────────────────────────
const Stepper = ({ value, onDecrease, onIncrease }) => (
  <div className="flex items-center rounded-xl border border-gray-200 dark:border-slate-600 overflow-hidden select-none">
    <button
      onClick={onDecrease}
      disabled={value === 1}
      className="w-9 h-9 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xl font-light"
    >
      −
    </button>
    <span className="w-9 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
      {value}
    </span>
    <button
      onClick={onIncrease}
      className="w-9 h-9 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-xl font-light"
    >
      +
    </button>
  </div>
);

// ── Cart row ──────────────────────────────────────────────────────────────────
const CartRow = ({ item, onRemove, onUpdate, animDelay }) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item._id), 280);
  };

  return (
    <div
      className={`flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm transition-all duration-300 hover:shadow-md card-enter ${
        removing ? "opacity-0 scale-95 pointer-events-none" : "opacity-100"
      }`}
      style={{ animationDelay: `${animDelay}ms` }}
    >
      <LazyImage src={item.images} alt={item.name} className="w-20 h-20 rounded-xl shrink-0" />

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug">
          {item.name}
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          ₹{item.price?.toLocaleString("en-IN")} each
        </p>
        <button
          onClick={handleRemove}
          className="mt-2 text-xs text-red-400 hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove
        </button>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <Stepper
          value={item.quantity}
          onDecrease={() => item.quantity > 1 && onUpdate(item._id, item.quantity - 1)}
          onIncrease={() => onUpdate(item._id, item.quantity + 1)}
        />
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          ₹{(item.price * item.quantity)?.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
};

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center py-28 text-center card-enter">
    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-6">
      <svg className="w-11 h-11 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
      Your cart is empty
    </h3>
    <p className="text-sm text-gray-400 dark:text-gray-500 mb-7 max-w-xs">
      Looks like you haven't added anything yet. Let's fix that!
    </p>
    <Link
      to="/shop"
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      Browse Shop
    </Link>
  </div>
);

// ── Summary panel ─────────────────────────────────────────────────────────────
const SummaryPanel = ({ cart, totalPrice }) => {
  const itemCount = cart.reduce((a, i) => a + i.quantity, 0);

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 h-fit sticky top-6 card-enter"
      style={{ animationDelay: "200ms" }}
    >
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">
        Order Summary
      </h3>

      {/* Mini item list */}
      <div className="space-y-2 mb-5 max-h-40 overflow-y-auto pr-1">
        {cart.map((item) => (
          <div key={item._id} className="flex justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
              {item.name?.split(" ").slice(0, 4).join(" ")}
              <span className="text-gray-400 ml-1">×{item.quantity}</span>
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-medium shrink-0 ml-2">
              ₹{(item.price * item.quantity)?.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t dark:border-slate-700 pt-4 space-y-2.5 mb-5">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
          <span>₹{totalPrice?.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Delivery</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Free</span>
        </div>
      </div>

      <div className="border-t dark:border-slate-700 pt-4 flex justify-between items-center mb-6">
        <span className="font-bold text-gray-900 dark:text-white">Total</span>
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          ₹{totalPrice?.toLocaleString("en-IN")}
        </span>
      </div>

      <Link to="/checkout" state={{ cart, totalPrice }}>
        <button className="w-full py-3.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-sm hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
          Proceed to Checkout
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </Link>

      <Link
        to="/shop"
        className="mt-3 w-full flex items-center justify-center text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors gap-1"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Continue shopping
      </Link>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cart.reduce((a, i) => a + i.quantity, 0);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .card-enter { animation: fadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .shimmer-bg { background-size: 200% 100%; animation: shimmer 1.6s infinite linear; }
      `}</style>

      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 py-10">

          {/* Header */}
          <div className="mb-8 card-enter">
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-1">
              Account
            </p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Shopping Cart
            </h1>
            {cart.length > 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
              </p>
            )}
          </div>

          {cart.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item, idx) => (
                  <CartRow
                    key={item._id}
                    item={item}
                    onRemove={removeFromCart}
                    onUpdate={updateQuantity}
                    animDelay={idx * 65}
                  />
                ))}
              </div>

              {/* Summary */}
              <SummaryPanel cart={cart} totalPrice={totalPrice} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;