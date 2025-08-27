import {
  updateProfile,
  resetPassword,
  forgotPassword,
  verifyEmailChange,
  contactUs,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

import express from "express";
const router = express.Router();
// update profile
router.put("/update-profile", protectRoute, updateProfile);

// forget password
router.post("/forget-password", forgotPassword);

// reset password
router.post("/reset-password", resetPassword);

// verify email change
router.get("/verify-email-change", verifyEmailChange);

// contact us
router.post("/contact-us", contactUs);

export default router;
