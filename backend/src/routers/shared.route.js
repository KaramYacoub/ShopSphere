import express from "express";

const router = express.Router();

import {
  getRandomThreeFeatureProducts,
  getAllProductsPublic,
  getAllCategories,
} from "../controllers/shared.controller.js";

router.get("/featured/random", getRandomThreeFeatureProducts);
router.get("/products", getAllProductsPublic);
router.get("/categories", getAllCategories);

export default router;
