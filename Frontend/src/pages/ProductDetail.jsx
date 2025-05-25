import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify"; // 🔹 Import Toastify

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState("");
const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://multivendor-ti71.onrender.com/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        if (error.response?.status === 404) {
          setProduct(null); 
          toast.error("Product not found!");
        }
      }
      if (!product) {
        return <p className="text-center text-gray-600 mt-10">Product not found</p>;
      }
      
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("✅ Product added to cart!");
  };

  if (!product) {
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  }

  const handleReviewSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://multivendor-ti71.onrender.com/api/products/${product._id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Review submitted!");
      setRating("");
      setComment("");
      // Refetch product to update reviews
      const res = await axios.get(`https://multivendor-ti71.onrender.com/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <img
  src={product.images?.[0] || "https://via.placeholder.com/300"}
  alt={product.name}
  className="w-full rounded-lg shadow-md"
/>

        <div>
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <p className="text-gray-600 mt-2">₹{product.price}</p>
          <p className="text-gray-700 mt-4">{product.description}</p>
          <p className="mt-2 text-sm text-green-600">
  {product.stock > 0 ? "In Stock" : "Out of Stock"}
</p>
<p className="text-yellow-500 mt-2">
  ⭐ {product.rating?.toFixed(1)} ({product.numReviews} reviews)
</p>



          {/* Add to Cart Button */}
          <button
  className={`mt-4 px-6 py-2 rounded-lg text-white ${
    product.stock > 0 ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
  }`}
  onClick={handleAddToCart}
  disabled={product.stock <= 0}
>
  Add to Cart
</button>

<div className="mt-6">
  <h4 className="text-xl font-semibold mb-2">Leave a Review</h4>
  <select
    className="border p-2 rounded w-full dark:text-black mb-2"
    value={rating}
    onChange={(e) => setRating(e.target.value)}
  >
    <option value="">Select Rating</option>
    <option value="1">1 - Poor</option>
    <option value="2">2 - Fair</option>
    <option value="3">3 - Good</option>
    <option value="4">4 - Very Good</option>
    <option value="5">5 - Excellent</option>
  </select>
  <textarea
    rows="4"
    placeholder="Write your review here..."
    className="border p-2 rounded w-full dark:text-black"
    value={comment}
    onChange={(e) => setComment(e.target.value)}
  />
  <button
    onClick={handleReviewSubmit}
    className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
  >
    Submit Review
  </button>
</div>

<div className="mt-8">
  <h4 className="text-xl font-semibold mb-2">Customer Reviews</h4>
  {product.reviews?.length === 0 ? (
    <p className="text-gray-500">No reviews yet.</p>
  ) : (
    product.reviews.map((review) => (
      <div key={review._id} className="border-b py-4">
        <p className="font-semibold">{review.name}</p>
        <p className="text-yellow-500">⭐ {review.rating}</p>
        <p>{review.comment}</p>
        <p className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
      </div>
    ))
  )}
</div>



        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
