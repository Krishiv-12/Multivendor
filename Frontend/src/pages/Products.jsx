import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products?page=${page}&limit=9`);
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, [page]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (category ? product.category === category : true)
  );

  const handleAddToWishlist = async (productId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/wishlist/add",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to wishlist!");
    } catch (error) {
      alert(error.response?.data?.message || "Error adding to wishlist");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">🛍️ Explore Our Products</h2>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <input
          type="text"
          placeholder="🔍 Search products..."
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-black"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home & Kitchen">Home & Kitchen</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-lg p-4 transition-transform hover:scale-[1.02] hover:shadow-2xl duration-300 dark:bg-slate-800">
              <img
                src={product.images[0] || "https://via.placeholder.com/300"}
                alt={product.name}
                className="h-72 w-96 object-cover rounded"
                loading="lazy"
              />
              <h3 className="text-lg font-semibold text-gray-800 truncate dark:text-gray-300 mt-4">{product.name}</h3>
              <p className="text-xl font-semibold text-green-600">₹{product.price}</p>
              <div className="mt-3 flex gap-2">
                <Link to={`/product/${product._id}`} className="w-full">
                   <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
                      View Details
                    </button>
                </Link>
                <button
                  onClick={() => handleAddToWishlist(product._id)}
                  className="bg-slate-300 hover:bg-pink-300 text-white px-3 py-2 rounded-lg"
                >
                  ❤️
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-3 text-center">No products found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-4 items-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          ← Prev
        </button>
        <span className="text-lg font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Products;
