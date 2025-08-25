import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update/:productId", updateCartItem);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

export default router;
