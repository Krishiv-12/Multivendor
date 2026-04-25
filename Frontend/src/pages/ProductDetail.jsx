import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";
import LazyImage from "../components/LazyImage";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://multivendor-ti71.onrender.com/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        if (error.response?.status === 404) {
          showToast("Product not found!", "error");
        } else {
          showToast("Failed to load product", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
    showToast("Product added to cart!", "success");
  };

  const handleReviewSubmit = async () => {
    if (!rating || !comment) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Please login to submit a review", "error");
        return;
      }
      await axios.post(
        `https://multivendor-ti71.onrender.com/api/products/${product._id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Review submitted!", "success");
      setRating(0);
      setComment("");

      // 🔄 Refetch product to update reviews
      const res = await axios.get(`https://multivendor-ti71.onrender.com/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to submit review", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/2 h-96 rounded-2xl bg-gray-200 dark:bg-slate-700 shimmer-bg" />
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-10 w-3/4 bg-gray-200 dark:bg-slate-700 shimmer-bg rounded-xl" />
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-slate-700 shimmer-bg rounded-lg" />
            <div className="h-24 w-full bg-gray-200 dark:bg-slate-700 shimmer-bg rounded-xl" />
            <div className="h-12 w-1/3 bg-gray-200 dark:bg-slate-700 shimmer-bg rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center card-enter">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 py-10">
      {ToastComponent}
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Product Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 card-enter">
          <div className="h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-700">
             <LazyImage src={product.images} alt={product.name} className="w-full h-full" imgClassName="object-contain p-4" />
          </div>

          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              {product.name}
            </h2>
            
            <div className="flex items-center text-yellow-400 mb-4 gap-1">
              <div className="flex text-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className={`w-5 h-5 ${star <= Math.round(product.rating || 0) ? "text-yellow-400" : "text-gray-300 dark:text-slate-600"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500 dark:text-gray-400 font-medium text-sm ml-2">
                {product.rating?.toFixed(1)} ({product.numReviews} review{product.numReviews !== 1 ? 's' : ''})
              </span>
            </div>

            <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
              ₹{product.price?.toLocaleString("en-IN")}
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {product.description}
            </p>
           
            <div className="mt-auto pt-6 border-t border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Availability</span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${product.stock > 0 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"}`}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              
              <button
                className={`w-full py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  product.stock > 0 
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-md hover:shadow-lg" 
                    : "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Write a Review */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 sticky top-6 card-enter" style={{ animationDelay: "150ms" }}>
              <h4 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Leave a Review</h4>
              
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Overall Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`text-2xl transition-transform hover:scale-110 focus:outline-none ${
                        star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-200 dark:text-slate-600"
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Your Experience</label>
                <textarea
                  rows="4"
                  placeholder="What did you like or dislike?"
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-4 rounded-2xl focus:ring-2 focus:ring-slate-400 focus:outline-none transition-all text-gray-700 dark:text-gray-200 resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <button
                onClick={handleReviewSubmit}
                disabled={!rating || !comment}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold transition-all duration-300 px-4 py-3.5 rounded-xl disabled:bg-gray-300 disabled:dark:bg-slate-700 disabled:text-gray-500 disabled:cursor-not-allowed shadow-sm"
              >
                Submit Review
              </button>
            </div>
          </div>

          {/* Customer Reviews List */}
          <div className="lg:col-span-2">
            <h4 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white card-enter" style={{ animationDelay: "200ms" }}>
              Customer Reviews
            </h4>
            
            {product.reviews?.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 card-enter" style={{ animationDelay: "250ms" }}>
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((review, idx) => (
                  <div key={review._id} className="bg-white dark:bg-slate-800 p-6 shadow-sm rounded-2xl border border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row gap-5 card-enter" style={{ animationDelay: `${250 + idx * 50}ms` }}>
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg uppercase shadow-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-base">{review.name}</p>
                          <div className="flex text-yellow-400 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg key={star} className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-200 dark:text-slate-600"}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-2 sm:mt-0 whitespace-nowrap">
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{review.comment}</p>
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
