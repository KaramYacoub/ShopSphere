import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/user.js";
import nodemailer from "nodemailer";

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
      <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px;">
        
        <h2 style="color: #DD7F1A; margin-bottom: 20px;">Welcome to ShopSphere 🎉</h2>
        
        <p style="color: #333; font-size: 16px;">Hello <b>${name}</b>,</p>
        <p style="color: #555; font-size: 15px; line-height: 1.5;">
          Thanks for signing up! Please confirm your email address by clicking the button below.
        </p>
        
        <a href="${verificationLink}" 
           style="display: inline-block; margin-top: 20px; background-color: #DD7F1A; color: white; 
                  padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;">
          Verify Email
        </a>
        
        <p style="color: #777; font-size: 13px; margin-top: 30px;">
          If the button doesn’t work, copy and paste this link into your browser:
        </p>
        <p style="color: #0066cc; word-break: break-all; font-size: 13px;">
          ${verificationLink}
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">
          This email was sent by <b>ShopSphere</b>. If you didn’t sign up, please ignore this message.
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
