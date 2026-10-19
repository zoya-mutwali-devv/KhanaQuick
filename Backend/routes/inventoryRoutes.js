import express from "express";
import {
  getInventory, updateStock, getLowStock
} from "../controllers/inventoryController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, authorize("admin", "staff"));

router.get("/", getInventory);
router.get("/low-stock", getLowStock);
router.patch("/:id", updateStock);

export default router;