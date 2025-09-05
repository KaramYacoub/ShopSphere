import bcrypt from "bcryptjs";
import User from "../models/user.js";
import WishList from "../models/wishlist.js";
import Order from "../models/order.js";
import Cart from "../models/cart.js";
import crypto from "crypto";
import { generateOTP, hashToken } from "../utils/security.js";
import { emailTemplates, sendEmail, receiveEmail } from "../utils/email.js";
import { isEmail, strongPassword } from "../utils/validators.js";

// update profile
export async function updateProfile(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { name, email, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update name
    if (typeof name === "string" && name.trim().length) {
      user.name = name.trim();
    }

    // Handle password change
    if (newPassword) {
      // For OAuth users without a password, allow setting a password directly
      if (!user.password) {
        if (!strongPassword(newPassword)) {
          return res.status(400).json({
            message:
              "New password must be at least 8 chars and include an uppercase letter and a number",
          });
        }
        user.password = await bcrypt.hash(newPassword, 10);
      } else {
        // For email/password users, require current password
        if (!currentPassword) {
          return res
            .status(400)
            .json({ message: "Current password is required" });
        }
        const ok = await bcrypt.compare(currentPassword, user.password);
        if (!ok)
          return res
            .status(400)
            .json({ message: "Current password is incorrect" });
        if (!strongPassword(newPassword)) {
          return res.status(400).json({
            message:
              "New password must be at least 8 chars and include an uppercase letter and a number",
          });
        }
        user.password = await bcrypt.hash(newPassword, 10);
      }
    }

    // Email change
    if (email && email !== user.email) {
      if (!isEmail(email))
        return res.status(400).json({ message: "Invalid email format" });

      const emailTaken = await User.findOne({ email });
      if (emailTaken)
        return res.status(400).json({ message: "Email already in use" });

      // create one-time email change token
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashToken(rawToken);
      user.pendingEmail = email;
      user.emailChangeToken = tokenHash;
      user.emailChangeTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h
      user.isVerified = false;

      // send confirmation link to NEW email
      const verifyLink = `${process.env.BACKEND_URL}/api/user/verify-email-change?token=${rawToken}`;
      await sendEmail(
        email,
        "Confirm Your New Email - ShopSphere",
        emailTemplates.updateEmail(user.name, verifyLink)
      );
    }

    await user.save();
    const safe = user.toObject();
    delete safe.password;
    delete safe.emailChangeToken;
    delete safe.emailChangeTokenExpires;
    delete safe.pendingEmail;

    return res.status(200).json({ success: true, user: safe });
  } catch (err) {
    console.error("Error in updateProfile:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// verify email change
export async function verifyEmailChange(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      if (req.get("accept") === "application/json") {
        return res.status(400).json({ message: "Invalid token" });
      } else {
        return res.redirect(
          `${process.env.FRONTEND_URL}/profile?error=Invalid token`
        );
      }
    }

    const tokenHash = hashToken(token);

    // Find user with this token that hasn't expired
    const user = await User.findOne({
      emailChangeToken: tokenHash,
      emailChangeTokenExpires: { $gt: Date.now() },
    }).select("+emailChangeToken +emailChangeTokenExpires +pendingEmail");

    if (!user) {
      if (req.get("accept") === "application/json") {
        return res.status(400).json({ message: "Invalid or expired token" });
      } else {
        return res.redirect(
          `${process.env.FRONTEND_URL}/profile?error=Invalid or expired token`
        );
      }
    }

    // Validate pendingEmail before using it
    if (!user.pendingEmail || !isEmail(user.pendingEmail)) {
      if (req.get("accept") === "application/json") {
        return res
          .status(400)
          .json({ message: "Invalid pending email address" });
      } else {
        return res.redirect(
          `${process.env.FRONTEND_URL}/profile?error=Invalid pending email address`
        );
      }
    }

    // Check if new email is already taken by another user
    const emailTaken = await User.findOne({
      email: user.pendingEmail,
      _id: { $ne: user._id }, // Exclude the current user
    });

    if (emailTaken) {
      if (req.get("accept") === "application/json") {
        return res.status(400).json({ message: "Email already in use" });
      } else {
        return res.redirect(
          `${process.env.FRONTEND_URL}/profile?error=Email already in use`
        );
      }
    }

    const newEmail = user.pendingEmail;

    user.pendingEmail = undefined;
    user.emailChangeToken = undefined;
    user.emailChangeTokenExpires = undefined;
    user.email = newEmail;
    user.isVerified = true;

    await user.save();

    if (req.get("accept") === "application/json") {
      return res.status(200).json({
        success: true,
        message: "Email updated successfully!",
      });
    } else {
      return res.redirect(
        `${process.env.FRONTEND_URL}/profile?message=Email updated successfully`
      );
    }
  } catch (error) {
    console.error("Error verifying email change:", error.message);

    if (req.get("accept") === "application/json") {
      return res.status(500).json({ message: "Failed to verify email change" });
    } else {
      return res.redirect(
        `${process.env.FRONTEND_URL}/profile?error=Failed to verify email change`
      );
    }
  }
}

// forgot password
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const genericMsg = {
      success: true,
      message: "An OTP has been sent to your email.",
    };

    if (!email) return res.status(200).json(genericMsg);

    const user = await User.findOne({ email }).select(
      "+resetOTP +resetOTPExpires"
    );
    if (!user) return res.status(200).json(genericMsg);

    // Generate 6-digit numeric OTP
    const otp = generateOTP();

    // Hash OTP before storing
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetOTP = otpHash;
    user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    // Send OTP via email with ShopSphere styling
    await sendEmail(
      user.email,
      "Password Reset OTP - ShopSphere",
      emailTemplates.forgotPasswordEmail(user.name, otp)
    );

    return res.status(200).json(genericMsg);
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// reset password
export async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, OTP, and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long and strong",
      });
    }

    const user = await User.findOne({ email }).select(
      "+resetOTP +resetOTPExpires +password"
    );
    if (!user || !user.resetOTP || !user.resetOTPExpires) {
      return res
        .status(400)
        .json({ message: "Invalid request or expired OTP" });
    }

    if (user.resetOTPExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Compare OTP hashes
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (otpHash !== user.resetOTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Reset password
    user.password = await bcrypt.hash(newPassword, 10);

    // Clear OTP fields
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;

    await user.save();

    // Send confirmation email with ShopSphere styling
    await sendEmail(
      user.email,
      "Password Changed Successfully - ShopSphere",
      emailTemplates.resetPasswordEmail(user.name)
    );

    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// contact us
export async function contactUs(req, res) {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res
        .status(400)
        .json({ message: "Subject and message are required" });
    }
    let name, email;
    if (req.user) {
      const user = await User.findById(req.user.id);
      name = user.name;
      email = user.email;
    } else {
      name = req.body.name;
      email = req.body.email;
    }

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    await receiveEmail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: subject,
      html: emailTemplates.contactUsEmail(name, email, message),
    });
    return res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error("Error in contactUs:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// delete account
export async function deleteAccount(req, res) {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await WishList.deleteMany({ userId: userId });
    await Order.deleteMany({ userId: userId });
    await Cart.deleteMany({ userId: userId });
    await User.findByIdAndDelete(userId);
    return res
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error("Error in deleteAccount:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
