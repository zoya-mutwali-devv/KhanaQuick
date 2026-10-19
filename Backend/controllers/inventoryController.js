import Food from "../models/Food.js";

export const getInventory = async (req, res, next) => {
  try {
    const inventory = await Food.find()
      .populate("category", "name")
      .select("name category stock lowStockThreshold isAvailable price");

    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({
        message: "Quantity must be a non-negative integer"
      });
    }

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      {
        stock: quantity,
        isAvailable: quantity > 0
      },
      { new: true, runValidators: true }
    );

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json({
      message: "Inventory updated",
      food,
      lowStock: food.stock <= food.lowStockThreshold
    });
  } catch (error) {
    next(error);
  }
};

export const getLowStock = async (req, res, next) => {
  try {
    const foods = await Food.find({
      $expr: { $lte: ["$stock", "$lowStockThreshold"] }
    }).populate("category", "name");

    res.json({
      count: foods.length,
      items: foods
    });
  } catch (error) {
    next(error);
  }
};
