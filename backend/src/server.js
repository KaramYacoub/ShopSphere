import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";

import "dotenv/config";

import "./config/passport.js";

import connectDB from "./config/db.js";

import authRouter from "./routers/auth.route.js";
import userRoutes from "./routers/user.route.js";
import wishlistRoutes from "./routers/wishlist.route.js";
import sharedRouter from "./routers/shared.route.js";
import cartRouter from "./routers/cart.route.js";
import orderRoutes from "./routers/order.routes.js";
import uploadRoutes from "./routers/upload.route.js";

import path from "path";
import { fileURLToPath } from "url";

const PORT = process.env.PORT;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

// Initialize passport
app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/user", userRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/shared", sharedRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
