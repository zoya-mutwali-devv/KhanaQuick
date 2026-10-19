import Review from "../models/Review.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";

export const getReviews = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.food) {
      filter.food = req.query.food;
    }

    const reviews = await Review.find(filter)
      .populate("user", "name")
      .populate("food", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { food, rating, comment } = req.body;
    
if (!mongoose.isValidObjectId(food)) {
  return res.status(400).json({
    message: "Invalid food ID"
  });
}

if (
  comment !== undefined &&
  (typeof comment !== "string" || comment.length > 1000)
) {
  return res.status(400).json({
    message: "Comment must be text with at most 1000 characters"
  });
}


    if (!food || rating === undefined) {
      return res.status(400).json({
        message: "Food ID and rating are required"
      });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5"
      });
    }

    const ordered = await Order.exists({
      user: req.user._id,
      status: "Delivered",
      "items.food": food
    });

    if (!ordered) {
      return res.status(403).json({
        message: "You can review food only after a completed order"
      });
    }

    const review = await Review.create({
      user: req.user._id,
      food,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};


export const deleteReview = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };

    if (req.user.role === "student") {
      filter.user = req.user._id;
    }

    const review = await Review.findOneAndDelete(filter);

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};