import Coupon from "../models/Coupon.js";

export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      discountPercent,
      minOrderAmount,
      maxDiscount,
      expiresAt,
      usageLimit
    } = req.body;

    if (!code || discountPercent === undefined) {
      return res.status(400).json({
        message: "Coupon code and discount percentage are required"
      });
    }

    const coupon = await Coupon.create({
      code,
      discountPercent,
      minOrderAmount: minOrderAmount ?? 0,
      maxDiscount: maxDiscount ?? null,
      expiresAt: expiresAt || null,
      usageLimit: usageLimit ?? null
    });

    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found"
      });
    }

    res.json(coupon);
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found"
      });
    }

    res.json({
      message: "Coupon deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    const amount = Number(subtotal);

    if (!code?.trim() || !Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Coupon code and a valid subtotal are required"
      });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }

    if (coupon.expiresAt && coupon.expiresAt <= new Date()) {
      return res.status(400).json({ message: "This coupon has expired" });
    }

    if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "This coupon has reached its usage limit" });
    }

    if (amount < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order of ₹${coupon.minOrderAmount} required for this coupon`
      });
    }

    let discount = Math.round((amount * coupon.discountPercent) / 100 * 100) / 100;

    if (coupon.maxDiscount != null) {
      discount = Math.min(discount, coupon.maxDiscount);
    }

    discount = Math.min(discount, amount);

    res.json({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      discount,
      total: Math.round((amount - discount) * 100) / 100
    });
  } catch (error) {
    next(error);
  }
};