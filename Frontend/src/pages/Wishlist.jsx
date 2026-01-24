import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext"; // 👈 Import Cart context

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const token = localStorage.getItem("token");
  const { addToCart } = useCart();

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://multivendor-ti71.onrender.com/api/wishlist",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setWishlistItems(res.data);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    const previousWishlist = [...wishlistItems];

    // 1️⃣ Instantly remove from UI
    setWishlistItems((prev) => prev.filter((item) => item._id !== id));
    setRemovingId(id);

    try {
      await axios.delete(
        `https://multivendor-ti71.onrender.com/api/wishlist/remove/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      // 2️⃣ Revert if error
      setWishlistItems(previousWishlist);
      alert("Failed to remove item. Try again.");
    } finally {
      setRemovingId(null);
    }
  };

  // ✅ Add to cart handler
  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    alert("Product added to cart!");
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <h2 className="text-4xl font-darker font-semibold mb-8 text-gray-800 dark:text-white">My Wishlist</h2>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Loading your wishlist...</p>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="h-56 w-full bg-gray-100 flex items-center justify-center">
                <img
                  src={item.product.images}
                  alt={item.product.name}
                  className="h-full object-contain group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-2xl font-darker font-medium text-gray-800 mb-1 line-clamp-1">
                  {item.product.name}
                </h3>

                <p className="text-sm font-semibold text-gray-600 mb-4">
                  ₹{item.product.price}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(item.product)}
                    className="flex-1 py-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-white hover:text-black border border-gray-300 transition duration-300"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => handleRemove(item._id)}
                    disabled={removingId === item._id}
                    className={`px-3 py-1 border border-gray-300 rounded-lg transition-all
    ${
      removingId === item._id
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-white text-black hover:bg-red-500 hover:text-white"
    }`}
                  >
                    {removingId === item._id ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
