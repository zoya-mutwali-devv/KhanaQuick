
import Cart from "../models/Cart.js";
import Food from "../models/Food.js";

// Add an item to the cart
export const addToCart = async (req, res, next) => {
  try {
    const { foodId, quantity = 1 } = req.body;

    if (!foodId || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Valid foodId and quantity are required"
      });
    }

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        message: "Food item not found"
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: []
      });
    }

    const existingItem = cart.items.find(
      item => item.food.toString() === foodId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ food: foodId, quantity });
    }

    await cart.save();

    res.status(200).json({
      message: "Item added to cart",
      cart
    });
  } catch (error) {
    next(error);
  }
};

// View the cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.food", "name price image");

    if (!cart) {
      return res.json({
        items: [],
        totalPrice: 0
      });
    }

    const totalPrice = cart.items.reduce((total, item) => {
      if (!item.food) return total;
      return total + item.food.price * item.quantity;
    }, 0);

    res.json({
      cart,
      totalPrice
    });
  } catch (error) {
    next(error);
  }
};

// Update item quantity
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { foodId } = req.params;

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be a positive integer"
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    const item = cart.items.find(
      item => item.food.toString() === foodId
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found in cart"
      });
    }

    item.quantity = quantity;
    await cart.save();

    res.json({
      message: "Cart quantity updated",
      cart
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    const initialLength = cart.items.length;

    cart.items = cart.items.filter(
      item => item.food.toString() !== req.params.foodId
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({
        message: "Item not found in cart"
      });
    }

    await cart.save();

    res.json({
      message: "Item removed from cart",
      cart
    });
  } catch (error) {
    next(error);
  }
};

// Clear the cart
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.json({ message: "Cart is already empty" });
    }

    cart.items = [];
    await cart.save();

    res.json({
      message: "Cart cleared successfully",
      cart
    });
  } catch (error) {
    next(error);
  }
};
