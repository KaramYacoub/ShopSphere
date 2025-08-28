import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/user.js";
import { validateLogin, validateSignup } from "../utils/validators.js";
import { setAuthCookie, clearAuthCookie } from "../utils/security.js";
import { emailTemplates, sendEmail } from "../utils/email.js";

// email/password signup
export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validationErrors = validateSignup(name, email, password);
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors[0] });
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
    sendEmail(
      email,
      "Verify your email - ShopSphere",
      emailTemplates.verifyEmail(user.name, verificationLink)
    );

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

    const validationErrors = validateLogin(email, password);
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors[0] });
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

    setAuthCookie(res, token);

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

      setAuthCookie(res, token);

      return res.redirect(`${process.env.FRONTEND_URL}/`);
    } catch (err) {
      console.error("Error in googleAuthCallback:", err);
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
    clearAuthCookie(res);
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
