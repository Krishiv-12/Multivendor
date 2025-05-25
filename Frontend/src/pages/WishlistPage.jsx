import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeFromWishlist } from "../redux/slices/wishlistSlice";
import { useSelector } from "react-redux";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);
  const wishlist = useSelector((state) => state.wishlist.items || []);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
      {items.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item._id} className="border p-4 rounded">
              <img src={item.product.image} alt={item.product.name} className="w-full h-32 object-cover" />
              <h3 className="text-lg font-bold">{item.product.name}</h3>
              <button
                onClick={() => dispatch(removeFromWishlist(item._id))}
                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
