import express from "express";

const router = express.Router();

import {
  getRandomThreeFeatureProducts,
  getProductById,
  getAllProducts,
  getAllCategories,
} from "../controllers/shared.controller.js";

router.get("/featured/random", getRandomThreeFeatureProducts);
router.get("/product/:id", getProductById);
router.get("/products", getAllProducts);
router.get("/categories", getAllCategories);

export default router;
