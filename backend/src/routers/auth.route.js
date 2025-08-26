import express from "express";
import {
  signup,
  login,
  googleAuth,
  googleAuthCallback,
  logout,
  verifyEmail,
  checkAuth,
  updateProfile,
  resetPassword,
  forgotPassword,
  verifyEmailChange,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Email/password signup
router.post("/signup", signup);

// Email/password login
router.post("/login", login);

// Google OAuth (init)
router.get("/google", googleAuth);

// Google OAuth callback
router.get("/google/callback", googleAuthCallback);

// logout
router.post("/logout", protectRoute, logout);

// verify email
router.get("/verify-email", verifyEmail);

// check auth
router.get("/me", protectRoute, checkAuth);

// update profile
router.put("/update-profile", protectRoute, updateProfile);

// forget password
router.post("/forget-password", forgotPassword);

// reset password
router.post("/reset-password", resetPassword);

// verify email change
router.get("/verify-email-change", verifyEmailChange);

export default router;
