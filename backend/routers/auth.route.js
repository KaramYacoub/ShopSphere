import express from "express";
import {
  signup,
  login,
  googleAuth,
  googleAuthCallback,
  logout,
  verifyEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Email/password routes
router.post("/signup", signup);
router.post("/login", login);

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

router.post("/logout", logout);

router.get("/verify-email", verifyEmail);

export default router;
