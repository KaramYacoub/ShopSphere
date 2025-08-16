import express from "express";
import {
  signup,
  login,
  googleAuth,
  googleAuthCallback,
  logout,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Email/password routes
router.post("/signup", signup);
router.post("/login", login);

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

router.post("/logout", logout);

export default router;
