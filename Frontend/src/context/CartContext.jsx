import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext();

const STORAGE_KEY = "cart_items";

export const CartProvider = ({ children }) => {
  // ── Initialise from localStorage so cart survives refresh ─────────────────
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // ── Sync to localStorage on every change ──────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // storage quota exceeded — fail silently
    }
  }, [cart]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id
            ? { ...i, quantity: i.quantity + (product.quantity ?? 1) }
            : i
        );
      }
      return [...prev, { ...product, quantity: product.quantity ?? 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};