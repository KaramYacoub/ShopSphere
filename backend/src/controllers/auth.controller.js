import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/user.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// email/password signup
export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use different one." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // verification link
    const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${verificationToken}`;
    // send email
    await transporter.sendMail({
      from: `"ShopSphere" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email - ShopSphere",
      html: `
   <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 30px;">
    
    <h2 style="color: #3b82f6; margin-bottom: 20px;">Welcome to ShopSphere 🎉</h2>
    
    <p style="color: #1f2937; font-size: 16px;">Hello <b>${name}</b>,</p>
    <p style="color: #374151; font-size: 15px; line-height: 1.5;">
      Thanks for signing up! Please confirm your email address by clicking the button below.
    </p>
    
    <a href="${verificationLink}" 
       style="display: inline-block; margin-top: 20px; background-color: #3b82f6; color: #ffffff; 
              padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;">
      Verify Email
    </a>
    
    <p style="color: #6b7280; font-size: 13px; margin-top: 30px;">
      If the button doesn’t work, copy and paste this link into your browser:
    </p>
    <p style="color: #2563eb; word-break: break-all; font-size: 13px;">
      ${verificationLink}
    </p>
    
    <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <p style="color: #1e40af; font-size: 14px; margin: 0;">
        This link will expire in <b>1 hour</b>. If you didn’t sign up, please ignore this email.
      </p>
    </div>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 12px;">
      This email was sent by <b>ShopSphere</b>.
    </p>
  </div>
</div>

  `,
    });

    res.status(201).json({
      success: true,
      message:
        "Signup successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// email/password login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email first" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Google OAuth (init)
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
  prompt: "select_account", // optional: always show chooser
  state: true, // CSRF protection
});

// Google OAuth callback
export const googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user) => {
    try {
      if (err) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(
            "Google authentication failed"
          )}`
        );
      }

      if (!user) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(
            "Authentication failed"
          )}`
        );
      }

      // Create access token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Set httpOnly cookie on the response — SAFER (no JS access)
      res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      // Done: no token in URL, just redirect home (or wherever you prefer)
      return res.redirect(`${process.env.FRONTEND_URL}/`);
    } catch (e) {
      console.error("Error in googleAuthCallback:", e);
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(
          "Unexpected error"
        )}`
      );
    }
  })(req, res, next);
};

// logout
export async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });

    res.status(201).json({ success: true, message: "logout successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// verify email
export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    user.isVerified = true;
    await user.save();

    if (req.get("accept") === "application/json") {
      return res.status(200).json({
        success: true,
        message: "Email verified successfully!",
      });
    } else {
      return res.redirect(
        `${process.env.FRONTEND_URL}/verify-email?token=${token}&verified=true`
      );
    }
  } catch (error) {
    console.error("Error verifying email:", error.message);
    if (req.get("accept") === "application/json") {
      return res.status(500).json({ message: "Invalid or expired token" });
    } else {
      return res.redirect(
        `${process.env.FRONTEND_URL}/verify-email?error=Invalid or expired token`
      );
    }
  }
}

// check auth
export async function checkAuth(req, res) {
  try {
    const user = req.user;
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in checkAuth controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const strongPassword = (v) =>
  typeof v === "string" && v.length >= 8 && /[A-Z]/.test(v) && /[0-9]/.test(v);

// helper: hash token (for DB)
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

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
      const verifyLink = `${process.env.BACKEND_URL}/api/auth/verify-email-change?token=${rawToken}`;
      await sendEmail({
        to: email,
        subject: "Confirm Your New Email - ShopSphere",
        html: `
  <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 30px;">
    
    <h2 style="color: #3b82f6; margin-bottom: 20px;">Confirm Your New Email 📧</h2>
    
    <p style="color: #1f2937; font-size: 16px;">Hello <b>{{user.name}}</b>,</p>
    <p style="color: #374151; font-size: 15px; line-height: 1.5;">
      You requested to change your email address for your ShopSphere account. Please confirm your new email by clicking the button below.
    </p>
    
    <a href="{{verifyLink}}" 
       style="display: inline-block; margin-top: 20px; background-color: #3b82f6; color: #ffffff; 
              padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;">
      Confirm Email
    </a>
    
    <p style="color: #6b7280; font-size: 13px; margin-top: 30px;">
      If the button doesn’t work, copy and paste this link into your browser:
    </p>
    <p style="color: #2563eb; word-break: break-all; font-size: 13px;">
      ${verifyLink}
    </p>
    
    <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <p style="color: #1e40af; font-size: 14px; margin: 0;">
        This link will expire in <b>1 hour</b>. If you didn’t request this, please ignore this email.
      </p>
    </div>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 12px;">
      This email was sent by <b>ShopSphere</b>. If you didn’t request an email change, please contact our support team immediately.
    </p>
  </div>
</div>
  `,
      });
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

    // ✅ Validate pendingEmail before using it
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

    // ✅ Check if new email is already taken by another user
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

    // ✅ Store the pending email in a variable before clearing
    const newEmail = user.pendingEmail;

    // ✅ Clear the pending fields first
    user.pendingEmail = undefined;
    user.emailChangeToken = undefined;
    user.emailChangeTokenExpires = undefined;

    // ✅ Now update the email field
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

    // ✅ More detailed error logging
    if (error.name === "ValidationError") {
      console.error("Validation errors:", error.errors);
    }

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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before storing
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetOTP = otpHash;
    user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    // Send OTP via email with ShopSphere styling
    await transporter.sendMail({
      from: `"ShopSphere" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset OTP - ShopSphere",
      html: `
   <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 30px;">
    
    <h2 style="color: #3b82f6; margin-bottom: 20px;">Password Reset Request 🔒</h2>
    
    <p style="color: #1f2937; font-size: 16px;">Hello <b>${user.name}</b>,</p>
    <p style="color: #374151; font-size: 15px; line-height: 1.5;">
      We received a request to reset your password. Use the OTP code below to proceed:
    </p>
    
    <div style="display: inline-block; margin: 20px 0; background-color: #eff6ff; 
                padding: 16px 24px; border-radius: 8px; font-size: 24px; 
                font-weight: bold; letter-spacing: 4px; color: #1e40af;">
      ${otp}
    </div>
    
    <div style="background-color: #fef9c3; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <p style="color: #92400e; font-size: 14px; margin: 0;">
        This OTP will expire in <b>10 minutes</b>. Do not share this code with anyone.
      </p>
    </div>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 12px;">
      This email was sent by <b>ShopSphere Security Team</b>.
    </p>
  </div>
</div>
  `,
    });

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

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and strong",
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
    await transporter.sendMail({
      from: `"ShopSphere" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Changed Successfully - ShopSphere",
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 30px;">
    
    <h2 style="color: #3b82f6; margin-bottom: 20px;">Password Updated Successfully ✅</h2>
    
    <p style="color: #1f2937; font-size: 16px;">Hello <b>${user.name}</b>,</p>
    <p style="color: #374151; font-size: 15px; line-height: 1.5;">
      Your ShopSphere account password has been successfully reset.
    </p>
    
    <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; 
                padding: 16px; border-radius: 8px; margin: 20px 0;">
      <p style="color: #065f46; font-size: 14px; margin: 0;">
        Your password was changed on: ${new Date().toLocaleString()}
      </p>
    </div>
    
    <a href="${process.env.FRONTEND_URL}/login" 
       style="display: inline-block; margin-top: 20px; background-color: #3b82f6; color: #ffffff; 
              padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;">
      Login to Your Account
    </a>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 12px;">
      This email was sent by <b>ShopSphere Security Team</b>. For your safety, do not forward this email.
    </p>
  </div>
</div>

  `,
    });

    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// send email
async function sendEmail(options) {
  try {
    const info = await transporter.sendMail({
      from: `"ShopSphere" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
}
