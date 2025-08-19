import jwt from "jsonwebtoken";
import User from "../models/user.js";

// middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// middleware to protect admin routes
export const protectAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admin only" });
    }
    next();
  } catch (error) {
    console.error("Error in protectAdmin middleware:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// middleware to protect user routes
export const protectUser = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "user") {
      return res.status(403).json({ message: "Forbidden - User only" });
    }
    next();
  } catch (error) {
    console.error("Error in protectUser middleware:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
