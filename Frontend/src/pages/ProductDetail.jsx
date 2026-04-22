import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { FaStar, FaRegStar } from "react-icons/fa";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://multivendor-ti71.onrender.com/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        if (error.response?.status === 404) {
          toast.error("❌ Product not found!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Product added to cart!");
  };

  const handleReviewSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://multivendor-ti71.onrender.com/api/products/${product._id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review submitted!");
      setRating(0);
      setComment("");

      // 🔄 Refetch product to update reviews
      const res = await axios.get(`https://multivendor-ti71.onrender.com/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center text-red-600 mt-10">Product not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src={
            product.images?.[0]
              ? product.images[0].replace("/upload/", "/upload/w_600,h_600,c_fill,f_auto,q_auto/")
              : "https://via.placeholder.com/300"
          }
          alt={product.name}
          className="w-full h-auto object-cover rounded-lg shadow-md"
          loading="lazy"
        />

        <div>
          <h2 className="text-4xl font-darker font-semibold">{product.name}</h2>
           <p className="text-gray-700">{product.description}</p>
          <p className="text-gray-600 mt-2 text-xl font-semibold">₹{product.price}</p>
         
          <p className="mt-2 text-sm text-green-600">
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>
          <div className="flex items-center text-yellow-400 mt-2 mb-4 space-x-1">
            <span className="flex text-lg">
              {[...Array(5)].map((_, i) => (
                i < Math.round(product.rating || 0) ? <FaStar key={i} /> : <FaRegStar key={i} />
              ))}
            </span>
            <span className="text-gray-600 font-medium ml-2 text-sm">
              {product.rating?.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>

          <button
            className={`mt-4 px-6 py-2 rounded-lg text-white ${
              product.stock > 0 ? "bg-black hover:bg-white hover:text-black border border-gray-300 transition-all duration-300" : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            Add to Cart
          </button>

          {/* ➕ Add Review */}
          <div className="mt-10 bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="text-2xl font-bold mb-4 text-gray-800">Leave a Review</h4>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-2xl transition-colors duration-200 focus:outline-none ${
                      star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
              <textarea
                rows="4"
                placeholder="What did you like or dislike?"
                className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow text-gray-700"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button
              onClick={handleReviewSubmit}
              disabled={!rating || !comment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 px-4 py-3 rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
            >
              Submit Review
            </button>
          </div>

          {/* 💬 Customer Reviews */}
          <div className="mt-12">
            <h4 className="text-2xl font-bold mb-6 text-gray-800">Customer Reviews</h4>
            {product.reviews?.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-lg">No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review._id} className="bg-white p-6 shadow-sm rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-xl uppercase">
                      {review.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{review.name}</p>
                          <div className="flex text-yellow-400 text-sm mt-1">
                            {[...Array(5)].map((_, i) => (
                              i < review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 font-medium whitespace-nowrap ml-4">
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <p className="mt-3 text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
