import Order from "../models/Order.js";
import Food from "../models/Food.js";

export const getAnalytics = async (req, res, next) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      revenue,
      popularFoods,
      lowStockCount
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({
        status: { $in: ["Pending", "Preparing"] }
      }),
      Order.countDocuments({ status: "Delivered" }),
      Order.aggregate([
        { $match: { paymentStatus: "Paid", status: { $ne: "Cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.food",
            name: { $first: "$items.name" },
            quantitySold: { $sum: "$items.quantity" },
            sales: { $sum: "$items.subtotal" }
          }
        },
        { $sort: { quantitySold: -1 } },
        { $limit: 5 }
      ]),
      Food.countDocuments({
        $expr: { $lte: ["$stock", "$lowStockThreshold"] }
      })
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalPaidRevenue: revenue[0]?.total ?? 0,
      lowStockCount,
      popularFoods
    });
  } catch (error) {
    next(error);
  }
};