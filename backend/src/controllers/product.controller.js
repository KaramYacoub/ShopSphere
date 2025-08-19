import Product from "../models/product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json({ success: true, products, length: products.length });
  } catch (error) {
    console.error("Error in getAllProducts controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.error("Error in getProductById controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({
      category: category,
    }).sort({ name: 1 });
    res.json({ success: true, products, length: products.length });
  } catch (error) {
    console.error("Error in getProductsByCategory controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductsBySearch = async (req, res) => {
  try {
    const search = req.params.search;
    const products = await Product.find({
      name: { $regex: search, $options: "i" },
    }).sort({ name: 1 });
    res.json({ success: true, products, length: products.length });
  } catch (error) {
    console.error("Error in getProductsBySearch controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSortedProducts = async (req, res) => {
  try {
    const { sort, order } = req.params;
    const products = await Product.find().sort({ [sort]: order });
    res.json({ success: true, products, length: products.length });
  } catch (error) {
    console.error("Error in getSortedProducts controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFilteredProducts = async (req, res) => {
  try {
    const { category, min, max } = req.query;
    let products = [];
    if (min && max && category) {
      products = await Product.find({
        category: category,
        price: { $gte: min, $lte: max },
      });
    } else if (min && max) {
      products = await Product.find({
        price: { $gte: min, $lte: max },
      });
    } else if (category && min) {
      products = await Product.find({
        category: category,
        price: { $gte: min },
      });
    } else if (category && max) {
      products = await Product.find({
        category: category,
        price: { $lte: max },
      });
    } else if (category) {
      products = await Product.find({
        category: category,
      });
    } else if (min) {
      products = await Product.find({
        price: { $gte: min },
      });
    } else if (max) {
      products = await Product.find({
        price: { $lte: max },
      });
    }
    const sortedProducts = products.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    res.json({
      success: true,
      products: sortedProducts,
      length: products.length,
    });
  } catch (error) {
    console.error("Error in getFilteredProducts controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
