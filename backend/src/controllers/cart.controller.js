import Cart from "../models/cart.js";
import Product from "../models/product.js";

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId",
      "name price image stock"
    );

    if (!cart) {
      return res.json({ success: true, cart: { items: [], total: 0 } });
    }

    res.json({ success: true, cart });
  } catch (error) {
    console.error("Error in getCart controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    // Create new cart if doesn't exist
    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [],
        total: 0,
      });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity,
        price: product.discountPrice || product.price,
        name: product.name,
        image: product.image,
      });
    }

    await cart.save();
    await cart.populate("items.productId", "name price image stock");

    res.json({ success: true, cart });
  } catch (error) {
    console.error("Error in addToCart controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate("items.productId", "name price image stock");

    res.json({ success: true, cart });
  } catch (error) {
    console.error("Error in updateCartItem controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.productId", "name price image stock");

    res.json({ success: true, cart });
  } catch (error) {
    console.error("Error in removeFromCart controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error in clearCart controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
