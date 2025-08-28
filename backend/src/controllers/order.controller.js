import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import { sendEmail, emailTemplates } from "../utils/email.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, shippingMethod, paymentMethod, orderNotes } =
      req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId",
      "name price image stock"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check stock availability
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}`,
        });
      }
    }

    // Calculate tax (8% for example)
    const taxRate = 0.08;
    const subtotal = cart.total;
    const tax = subtotal * taxRate;
    const shippingCost = shippingMethod?.price || 0;
    const total = subtotal + tax + shippingCost;

    // Generate order number manually as fallback
    const generateOrderNumber = () => {
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      return `ORD-${timestamp.slice(-6)}-${random}`;
    };

    // Create order
    const order = new Order({
      userId: req.user._id,
      orderNumber: generateOrderNumber(),
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
      })),
      subtotal,
      shippingCost,
      tax,
      total,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      paymentStatus: "completed",
      status: "confirmed",
      estimatedDelivery: calculateEstimatedDelivery(shippingMethod?.delivery),
      orderNotes,
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    // Save order
    await order.save();
    await order.populate("items.productId", "name price image");

    // Get user details for email
    const user = await User.findById(req.user._id);

    // Send order confirmation email
    // Get email content with attachments
    const { html, attachments } = emailTemplates.generateOrderConfirmationEmail(
      user,
      order,
      shippingAddress
    );

    try {
      await sendEmail(
        shippingAddress.email,
        `Order Confirmation - ${order.orderNumber}`,
        html,
        attachments
      );
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error in createOrder controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user's orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.productId", "name image");

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error in getOrders controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      userId: req.user._id,
    }).populate("items.productId", "name price image");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("Error in getOrder controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error in updateOrderStatus controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      userId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow cancellation for pending or confirmed orders
    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        message: "Cannot cancel order at this stage",
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error in cancelOrder controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function to calculate estimated delivery
function calculateEstimatedDelivery(deliveryString) {
  if (!deliveryString) return new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // Default 5 days

  const daysMatch = deliveryString.match(/(\d+)-(\d+)/);
  if (daysMatch) {
    const maxDays = parseInt(daysMatch[2]);
    return new Date(Date.now() + maxDays * 24 * 60 * 60 * 1000);
  }

  return new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // Default 5 days
}
