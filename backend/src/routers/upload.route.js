import express from "express";
import upload from "../config/cloudinary.js";

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // Cloudinary returns the secure URL directly
  const imageUrl = req.file.path;
  res.json({ imageUrl });
});

export default router;
