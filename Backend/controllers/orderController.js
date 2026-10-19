
import { io } from "../server.js";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Food from "../models/Food.js";
import Coupon from "../models/Coupon.js";

const roundMoney = (value) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

export const createOrder = async (req, res, next) => {
  try {
    const { items, couponCode, paymentMethod = "Cash", pickupTime } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!["Cash", "UPI"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Payment method must be Cash or UPI"
      });
    }
        let pickupDate = null;

    if (pickupTime) {
      pickupDate = new Date(pickupTime);

      if (Number.isNaN(pickupDate.getTime())) {
        return res.status(400).json({ message: "Invalid pickup time" });
      }

      if (pickupDate.getTime() < Date.now() - 60 * 1000) {
        return res.status(400).json({
          message: "Pickup time cannot be in the past"
        });
      }
    }

    const quantities = new Map();

    for (const item of items) {
      if (
        !mongoose.isValidObjectId(item.food) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          message: "Each item needs a valid food ID and positive integer quantity"
        });
      }

      quantities.set(
        item.food,
        (quantities.get(item.food) || 0) + item.quantity
      );
    }

    const orderItems = [];
    const reservations = [];
    let subtotal = 0;
    let discount = 0;
    let coupon = null;
    let couponIncremented = false;
    let orderSaved = false;

    try {
      for (const [foodId, quantity] of quantities) {
        const food = await Food.findOneAndUpdate(
          {
            _id: foodId,
            isAvailable: true,
            stock: { $gte: quantity }
          },
          { $inc: { stock: -quantity } },
          { new: true }
        );

        if (!food) {
          throw Object.assign(
            new Error(`Food unavailable or insufficient stock: ${foodId}`),
            { status: 409 }
          );
        }

        reservations.push({ foodId, quantity });

        const itemSubtotal = roundMoney(food.price * quantity);
        subtotal = roundMoney(subtotal + itemSubtotal);

        orderItems.push({
          food: food._id,
          name: food.name,
          quantity,
          price: food.price,
          subtotal: itemSubtotal
        });
      }

      if (couponCode) {
        const now = new Date();

        coupon = await Coupon.findOneAndUpdate(
          {
            code: couponCode.trim().toUpperCase(),
            isActive: true,
            minOrderAmount: { $lte: subtotal },
            $and: [
              {
                $or: [
                  { expiresAt: null },
                  { expiresAt: { $gt: now } }
                ]
              },
              {
                $or: [
                  { usageLimit: null },
                  {
                    $expr: {
                      $lt: ["$usedCount", "$usageLimit"]
                    }
                  }
                ]
              }
            ]
          },
          { $inc: { usedCount: 1 } },
          { new: true }
        );

        if (!coupon) {
          throw Object.assign(
            new Error("Coupon is invalid, expired, or unavailable"),
            { status: 400 }
          );
        }

        couponIncremented = true;

        discount = roundMoney(
          subtotal * coupon.discountPercent / 100
        );

        if (coupon.maxDiscount != null) {
          discount = Math.min(discount, coupon.maxDiscount);
        }

        discount = Math.min(discount, subtotal);
      }

      const totalAmount = roundMoney(subtotal - discount);

      const tokenNumber = `KQ-${Date.now()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

           const order = await Order.create({
        tokenNumber,
        user: req.user._id,
        items: orderItems,
        subtotal,
        discount,
        totalAmount,
        coupon: coupon?._id ?? null,
        paymentMethod,
        paymentStatus: "Pending",
        pickupTime: pickupDate
      });
      orderSaved = true;

      return res.status(201).json({
        message: "Order placed successfully",
        order
      });
    } catch (error) {
      if (!orderSaved) {
        await Promise.allSettled(
          reservations.map(({ foodId, quantity }) =>
            Food.updateOne(
              { _id: foodId },
              { $inc: { stock: quantity } }
            )
          )
        );

        if (couponIncremented) {
          await Coupon.updateOne(
            { _id: coupon._id },
            { $inc: { usedCount: -1 } }
          );
        }
      }

      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === "student") {
      filter.user = req.user._id;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("coupon", "code discountPercent")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };

    if (req.user.role === "student") {
      filter.user = req.user._id;
    }

    const order = await Order.findOne(filter)
      .populate("user", "name email")
      .populate("coupon", "code discountPercent");

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    return res.json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const allowedStatuses = [
      "Pending",
      "Preparing",
      "Ready",
      "Delivered",
      "Cancelled"
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (
      order.status === "Cancelled" ||
      order.status === "Delivered"
    ) {
      return res.status(400).json({
        message: "This order can no longer be modified"
      });
    }

    const transitions = {
      Pending: ["Preparing", "Cancelled"],
      Preparing: ["Ready", "Cancelled"],
      Ready: ["Delivered", "Cancelled"]
    };

    if (!transitions[order.status]?.includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${order.status} to ${status}`
      });
    }

    if (status === "Cancelled") {
      for (const item of order.items) {
        await Food.updateOne(
          { _id: item.food },
          { $inc: { stock: item.quantity } }
        );
      }

      if (order.coupon) {
        await Coupon.updateOne(
          {
            _id: order.coupon,
            usedCount: { $gt: 0 }
          },
          { $inc: { usedCount: -1 } }
        );
      }
    }

    order.status = status;
    await order.save();

    // Send real-time notification to this user's Socket.IO room.
    io.to(order.user.toString()).emit("orderStatusUpdated", {
      orderId: order._id,
      tokenNumber: order.tokenNumber,
      status: order.status,
      message: `Your order ${order.tokenNumber} is now ${order.status}`
    });

    return res.json({
      message: "Order status updated",
      order
    });
  } catch (error) {
    next(error);
  }
};

export const payOrder = async (req, res, next) => {
  try {
       const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({
        message: "Cancelled orders cannot be paid"
      });
    }

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        message: "Order is already marked as paid"
      });
    }

    // Records payment collected at the counter.
    // This does not verify an actual UPI transaction.
    order.paymentStatus = "Paid";
    order.paidAt = new Date();

    await order.save();

    return res.json({
      message: "Payment recorded successfully",
      order
    });
  } catch (error) {
    next(error);
  }
};

export const getBill = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };

    if (req.user.role === "student") {
      filter.user = req.user._id;
    }

    const order = await Order.findOne(filter)
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    return res.json({
      billNumber: order.tokenNumber,
      date: order.createdAt,
      customer: order.user,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status
    });
  } catch (error) {
    next(error);
  }
};

export const getQueueCount = async (req, res, next) => {
  try {
    const pendingOrders = await Order.countDocuments({
      status: "Pending"
    });

    const preparingOrders = await Order.countDocuments({
      status: "Preparing"
    });

    const queueCount = pendingOrders + preparingOrders;
    const minutesPerOrder = 5;
    const estimatedWaitMinutes = queueCount * minutesPerOrder;

    return res.status(200).json({
      queueCount,
      pendingOrders,
      preparingOrders,
      estimatedWaitMinutes
    });
  } catch (error) {
    next(error);
  }
};
