import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext"; // 👈 Import Cart context

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const token = localStorage.getItem("token");
  const { addToCart } = useCart(); // 👈 useCart hook se addToCart le liya

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("https://multivendor-ti71.onrender.com/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems(res.data);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`https://multivendor-ti71.onrender.com/api/wishlist/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWishlist(); // Refresh wishlist
    } catch (error) {
      alert("Error removing item");
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
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Your Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wishlistItems.map((item) => (
            <div key={item._id} className="border p-4 rounded shadow">
              <img
                src={item.product.images}
                alt={item.product.name}
                className="w-32 h-32 object-cover mb-2"
              />
              <h3 className="font-bold text-lg">{item.product.name}</h3>
              <p className="text-gray-600 mb-2">{item.product.price} ₹</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(item.product)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => handleRemove(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
