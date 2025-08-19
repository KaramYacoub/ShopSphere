import Product from "../models/product.js";

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

export const getAllProductsPublic = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 9, 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category && category !== '') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter)
    ]);

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
        limit: limitNum
      }
    });
  } catch (error) {
    console.error("Error in getAllProductsPublic controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Product.find().distinct("category");
    res.json({ success: true, categories });
  } catch (error) {
    console.error("Error in getAllCategories controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
