
import express from "express";
import { protect } from "../middleware/auth.js";

import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/item/:foodId", protect, updateCartItem);
router.delete("/item/:foodId", protect, removeFromCart);
router.delete("/clear", protect, clearCart);

export default router;
