import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error("🚨 Invalid token!");
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.error("🚨 No token found!");
    res.status(401).json({ message: "Not authorized, no token" });
  }
});




// ✅ Exports (Already Correct)
export const isVendor = (req, res, next) => {
  if (req.user && req.user.role === "vendor") {
    next();
  } else {
    res.status(403).json({ message: "Access Denied! Vendor Only" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access Denied! Admin Only" });
  }
};
