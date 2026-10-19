import Order from "../models/Order.js";
import Food from "../models/Food.js";
import Category from "../models/Category.js";

export const getFoods = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }

    if (req.query.available === "true") {
      filter.isAvailable = true;
      filter.stock = { $gt: 0 };
    }

    const foods = await Food.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(foods);
  } catch (error) {
    next(error);
  }
};

export const getFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate("category", "name");

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json(food);
  } catch (error) {
    next(error);
  }
};

export const createFood = async (req, res, next) => {
  try {
    const { name, category, price, stock, description, image,
      lowStockThreshold } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        message: "Name, category and price are required"
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const food = await Food.create({
      name,
      category,
      price,
      stock: stock ?? 0,
      description,
      image,
      lowStockThreshold: lowStockThreshold ?? 5
    });

    res.status(201).json(food);
  } catch (error) {
    next(error);
  }
};

export const updateFood = async (req, res, next) => {
  try {
    if (req.body.category) {
      const exists = await Category.findById(req.body.category);

      if (!exists) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
    }

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json(food);
  } catch (error) {
    next(error);
  }
};

export const deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json({ message: "Food item deleted successfully" });
  } catch (error) {
    next(error);
  }
};
export const getTrendingFoods = async (req, res, next) => {
  try {
    const trendingFoods = await Order.aggregate([
      {
        $match: {
          status: { $ne: "Cancelled" }
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.food",
          totalOrdered: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "foods",
          localField: "_id",
          foreignField: "_id",
          as: "food"
        }
      },
      { $unwind: "$food" },
      {
        $project: {
          _id: "$food._id",
          name: "$food.name",
          price: "$food.price",
          image: "$food.image",
          category: "$food.category",
          totalOrdered: 1
        }
      }
    ]);

    return res.status(200).json({
      count: trendingFoods.length,
      trendingFoods
    });
  } catch (error) {
    next(error);
  }
};