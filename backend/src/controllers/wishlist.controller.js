import wishlist from "../models/wishlist.js";

export const getWishlist = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const sortBy = req.query.sortBy || "name";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    // Get wishlist items with populated product data
    const wishlistItems = await wishlist
      .find({ userId: req.user._id })
      .populate("productId")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalItems = await wishlist.countDocuments({ userId: req.user._id });
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      products: wishlistItems.map((item) => item.productId),
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: totalItems,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.log("Error in getWishlist controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const wishlistItem = await wishlist.create({
      userId: req.user._id,
      productId,
    });
    res.status(201).json({ success: true, wishlistItem });
  } catch (error) {
    console.log("Error in addToWishlist controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlistItem = await wishlist.findOneAndDelete({
      userId: req.user._id,
      productId,
    });
    res.status(200).json({ success: true, wishlistItem });
  } catch (error) {
    console.log("Error in removeFromWishlist controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const wishlistItems = await wishlist.deleteMany({ userId: req.user._id });
    res.status(200).json({ success: true, wishlistItems });
  } catch (error) {
    console.log("Error in clearWishlist controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
