import Wishlist from "../models/wishlist.js";

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  try {
    const alreadyInWishlist = await Wishlist.findOne({ user: userId, product: productId });
    if (alreadyInWishlist) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    const newItem = new Wishlist({ user: userId, product: productId });
    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist" });
  }
};

// Get all wishlist items for logged-in user
export const getWishlist = async (req, res) => {
  const userId = req.user._id;

  try {
    const wishlistItems = await Wishlist.find({ user: userId }).populate("product");
    res.status(200).json(wishlistItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist" });
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Wishlist.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Error removing item" });
  }
};
