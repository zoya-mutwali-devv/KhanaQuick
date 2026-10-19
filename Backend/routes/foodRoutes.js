
import express from "express";
import {
  getFoods,
  getFood,
  getTrendingFoods,
  createFood,
  updateFood,
  deleteFood
} from "../controllers/foodController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getFoods);
router.get("/trending", getTrendingFoods);
router.get("/:id", getFood);

router.post("/", protect, authorize("admin", "staff"), createFood);
router.put("/:id", protect, authorize("admin", "staff"), updateFood);
router.delete("/:id", protect, authorize("admin"), deleteFood);

export default router;
