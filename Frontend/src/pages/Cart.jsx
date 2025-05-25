import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b py-4">
              <img src={item.images} alt={item.name} className="w-16 h-16 rounded" />
              <h3 className="flex-1 ml-4">{item.name}</h3>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                className="w-12 mr-2 text-center border dark:text-black"
              />
              <p>₹{item.price * item.quantity}</p>
              <button onClick={() => removeFromCart(item._id)} className="text-red-500 ml-2">Remove</button>
            </div>
          ))}
          
          <h3 className="text-xl font-semibold mt-4">Total: ₹{totalPrice}</h3>
          <Link
  to="/checkout"
  state={{ cart, totalPrice }}
>
  <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg">
    Proceed to Checkout
  </button>
</Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
