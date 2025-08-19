import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";

import "dotenv/config";

import "./config/passport.js";

import connectDB from "./config/db.js";

import authRouter from "./routers/auth.route.js";
import ProductRouter from "./routers/product.route.js";
import sharedRouter from "./routers/shared.route.js";

import { protectRoute, protectUser } from "./middlewares/auth.middleware.js";

const PORT = process.env.PORT;

const app = express();

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

app.use("/api/shared", sharedRouter);
app.use("/api/auth", authRouter);
app.use("/api/product", protectRoute, protectUser, ProductRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
