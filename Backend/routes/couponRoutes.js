import express from "express";
import {
  getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon
} from "../controllers/couponController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, authorize("admin", "staff"), getCoupons);
router.post("/", protect, authorize("admin"), createCoupon);
router.post("/validate", protect, validateCoupon);
router.put("/:id", protect, authorize("admin"), updateCoupon);
router.delete("/:id", protect, authorize("admin"), deleteCoupon);

export default router;