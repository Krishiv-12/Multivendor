import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-semibold font-darker text-gray-900 dark:text-white mb-8">
        Shopping Cart
      </h2>

      {cart.length === 0 ? (
        /* Empty Cart */
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl">
          <p className="text-lg text-gray-500 mb-4">
            Your cart is currently empty
          </p>
          <Link
            to="/shop"
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-black border border-gray-300 transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-white rounded-xl shadow-sm border p-4"
              >
                {/* Image */}
                <img
                  src={item.images}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    ₹{item.price} × {item.quantity}
                  </p>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="mt-2 text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                {/* Quantity */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    {/* Decrease */}
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      disabled={item.quantity === 1}
                      className={`px-2 py-1 text-lg font-semibold transition
      ${
        item.quantity === 1
          ? "text-gray-300 cursor-not-allowed"
          : "text-gray-700 hover:bg-gray-100"
      }`}
                    >
                      −
                    </button>

                    {/* Quantity */}
                    <span className="px-4 py-1 font-medium text-gray-900">
                      {item.quantity}
                    </span>

                    {/* Increase */}
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      className="px-2 py-1 text-lg font-semibold text-gray-700 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold text-gray-900">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-sm border p-6 h-fit">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h3>

            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>

            <div className="flex justify-between text-gray-600 mb-4">
              <span>Delivery</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="flex justify-between text-lg font-semibold text-gray-900 border-t pt-4">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>

            <Link to="/checkout" state={{ cart, totalPrice }}>
              <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
