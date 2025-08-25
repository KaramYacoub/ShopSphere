import Product from "../models/product.js";
import Category from "../models/category.js";

export const getRandomThreeFeatureProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({
      isFeatured: true,
    });
    const randomProducts = allProducts
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    res.json({ success: true, randomProducts });
  } catch (error) {
    console.error(
      "Error in getRandomThreeFeatureProducts controller:",
      error.message
    );
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

export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = "name",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (category && category !== "") {
      filter.categoryName = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);
    const totalProducts = await Product.countDocuments(filter);

    if (totalProducts === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    for (const product of products) {
      const productCategory = await Category.findById(product.category);
      if (productCategory) {
        product.categoryName = productCategory.name;
      }
    }

    // Calculate pagination info
    const totalPages = Math.ceil(totalProducts / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        hasNextPage,
        hasPrevPage,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error("Error in getAllProductsPublic controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categoriesIds = await Product.find().distinct("category");
    const categories = await Category.find({ _id: { $in: categoriesIds } });
    res.json({ success: true, categories });
  } catch (error) {
    console.error("Error in getAllCategories controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
