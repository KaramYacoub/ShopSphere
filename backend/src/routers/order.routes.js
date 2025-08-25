import express from "express";
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/order.controller.js";
import { protectRoute, protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createOrder);
router.get("/", protectRoute, getOrders);
router.get("/:orderId", protectRoute, getOrder);
router.put("/:orderId/status", protectRoute, protectAdmin, updateOrderStatus);
router.put("/:orderId/cancel", protectRoute, cancelOrder);

export default router;
