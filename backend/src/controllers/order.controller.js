import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import User from "../models/user.js"; // Import User model
import nodemailer from "nodemailer";

// Create nodemailer transporter (reuse your existing one)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
    try {
      await sendOrderConfirmationEmail(user, order, shippingAddress);
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError);
      // Don't fail the order creation if email fails
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

// Email sending function
async function sendOrderConfirmationEmail(user, order, shippingAddress) {
  const mailOptions = {
    from: `"ShopSphere" <${process.env.EMAIL_USER}>`,
    to: shippingAddress.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: generateOrderConfirmationEmail(user, order, shippingAddress),
  };

  await transporter.sendMail(mailOptions);
}

// Email template generator
function generateOrderConfirmationEmail(user, order, shippingAddress) {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: left;">
        <img src="${process.env.BACKEND_URL}/${item.image}" alt="${
        item.name
      }" width="60" style="border-radius: 4px;">
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: left;">
        <div style="font-weight: 600;">${item.name}</div>
        <div style="color: #666; font-size: 14px;">Qty: ${item.quantity}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #DD7F1A, #FF9F43); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed! 🎉</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
            Thank you for your purchase, ${user.name}!
          </p>
        </div>

        <!-- Order Details -->
        <div style="padding: 30px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #333; margin: 0 0 15px; font-size: 18px;">Order Summary</h2>
            <p style="margin: 5px 0; color: #666;">
              <strong>Order Number:</strong> ${order.orderNumber}
            </p>
            <p style="margin: 5px 0; color: #666;">
              <strong>Order Date:</strong> ${new Date().toLocaleDateString()}
            </p>
            <p style="margin: 5px 0; color: #666;">
              <strong>Status:</strong> <span style="color: #10b981; font-weight: 600;">Confirmed</span>
            </p>
          </div>

          <!-- Order Items -->
          <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            <thead>
              <tr>
                <th style="padding: 12px; border-bottom: 2px solid #eee; text-align: left; width: 80px;">Image</th>
                <th style="padding: 12px; border-bottom: 2px solid #eee; text-align: left;">Product</th>
                <th style="padding: 12px; border-bottom: 2px solid #eee; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Order Totals -->
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span style="color: #666;">Subtotal:</span>
              <span style="font-weight: 600;">$${order.subtotal.toFixed(
                2
              )}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span style="color: #666;">Shipping:</span>
              <span style="font-weight: 600;">${
                order.shippingCost === 0
                  ? "Free"
                  : `$${order.shippingCost.toFixed(2)}`
              }</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span style="color: #666;">Tax:</span>
              <span style="font-weight: 600;">$${order.tax.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0; padding-top: 15px; border-top: 2px solid #ddd;">
              <span style="color: #333; font-weight: 700; font-size: 18px;">Total:</span>
              <span style="color: #DD7F1A; font-weight: 700; font-size: 18px;">$${order.total.toFixed(
                2
              )}</span>
            </div>
          </div>

          <!-- Shipping Information -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
            <div>
              <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">Shipping Address</h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <p style="margin: 5px 0; color: #666;">
                  <strong>${shippingAddress.firstName} ${
    shippingAddress.lastName
  }</strong>
                </p>
                <p style="margin: 5px 0; color: #666;">${
                  shippingAddress.address
                }</p>
                <p style="margin: 5px 0; color: #666;">
                  ${shippingAddress.city}, ${shippingAddress.state} ${
    shippingAddress.zipCode
  }
                </p>
                <p style="margin: 5px 0; color: #666;">${
                  shippingAddress.country
                }</p>
                <p style="margin: 5px 0; color: #666;">📞 ${
                  shippingAddress.phone
                }</p>
              </div>
            </div>

            <div>
              <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">Shipping Method</h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <p style="margin: 5px 0; color: #666;">
                  <strong>${order.shippingMethod.name}</strong>
                </p>
                <p style="margin: 5px 0; color: #666;">
                  Estimated Delivery: ${order.shippingMethod.delivery}
                </p>
                <p style="margin: 5px 0; color: #666;">
                  Shipping Cost: ${
                    order.shippingCost === 0
                      ? "Free"
                      : `$${order.shippingCost.toFixed(2)}`
                  }
                </p>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">Payment Information</h3>
            <p style="margin: 5px 0; color: #666;">
              <strong>Payment Method:</strong> ${order.paymentMethod}
            </p>
            <p style="margin: 5px 0; color: #666;">
              <strong>Payment Status:</strong> <span style="color: #10b981; font-weight: 600;">Completed</span>
            </p>
          </div>

          <!-- Next Steps -->
          <div style="text-align: center; margin-top: 30px; padding-top: 25px; border-top: 1px solid #eee;">
            <h3 style="color: #333; margin: 0 0 15px;">What's Next?</h3>
            <p style="color: #666; margin: 0 0 20px;">
              We'll send you another email when your order ships. You can also check your order status anytime in your account.
            </p>
            <a href="${process.env.FRONTEND_URL}/orders" 
               style="display: inline-block; background-color: #DD7F1A; color: white; 
                      padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View Order Details
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
          <p style="color: #999; margin: 0; font-size: 14px;">
            Thank you for shopping with ShopSphere!<br>
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  `;
}

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
