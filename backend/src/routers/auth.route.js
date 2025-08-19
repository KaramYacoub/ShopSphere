import express from "express";
import {
  signup,
  login,
  googleAuth,
  googleAuthCallback,
  logout,
  verifyEmail,
  checkAuth,
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
router.post("/logout", logout);

// verify email
router.get("/verify-email", verifyEmail);

// check auth
router.get("/me", protectRoute, checkAuth);

export default router;
