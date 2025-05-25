import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc Get All Users
// @route GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc Update User Role
// @route PUT /api/admin/users/:id
export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = req.body.role || user.role;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc Delete User
// @route DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc Get All Orders
// @route GET /api/admin/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc Get All Products
// @route GET /api/admin/products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("vendor", "name email");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" }).select("name email");
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const vendorsCount = await User.countDocuments({ role: "vendor" });
    const ordersCount = await Order.countDocuments();
    const productsCount = await Product.countDocuments();

    res.status(200).json({
      users: usersCount,
      vendors: vendorsCount,
      orders: ordersCount,
      products: productsCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
};

export const toggleUserBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ message: `User ${user.isBanned ? "banned" : "unbanned"} successfully!` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, price, category } = req.body;
    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};


