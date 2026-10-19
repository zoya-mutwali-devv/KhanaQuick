
import express from "express";
import {
  createOrder, getOrders, getOrderById,
  updateOrderStatus, payOrder, getBill,
  getQueueCount
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.post("/", authorize("student"), createOrder);
router.get("/", getOrders);
router.get("/queue", getQueueCount);
router.get("/:id/bill", getBill);
router.get("/:id", getOrderById);
router.patch(
  "/:id/status",
  authorize("admin", "staff"),
  updateOrderStatus
);
router.patch("/:id/pay", authorize("admin", "staff"), payOrder);

export default router;
