import express from "express";

const router = express.Router();

import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsBySearch,
  getSortedProducts,
  getFilteredProducts,
} from "../controllers/product.controller.js";

router.get("/getAllProducts", getAllProducts);
router.get("/getProductById/:id", getProductById);
router.get("/getProductsByCategory/:category", getProductsByCategory);
router.get("/search/:search", getProductsBySearch);
router.get("/sort/:sort/:order", getSortedProducts);
router.get("/filter", getFilteredProducts);

export default router;
