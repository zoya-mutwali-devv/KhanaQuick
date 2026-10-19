import express from "express";
import {
  getReviews, createReview, deleteReview
} from "../controllers/reviewController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getReviews);
router.post("/", protect, authorize("student"), createReview);
router.delete("/:id", protect, deleteReview);

export default router;