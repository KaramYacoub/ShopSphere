import express from "express";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

export default router;
