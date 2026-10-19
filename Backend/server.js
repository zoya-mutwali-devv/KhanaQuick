import { createServer } from "node:http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import { protect, authorize } from "./middleware/auth.js";
import {
  notFound,
  errorHandler
} from "./middleware/errorHandler.js";

import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";


import n from "node:dns/promises";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import analyticRoutes from "./routes/analyticRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
n.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// Create HTTP server and Socket.IO
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
  }
});
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new Error("User no longer exists"));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
  const userRoom = socket.user._id.toString();

  socket.join(userRoom);

  console.log(`Authenticated user connected: ${userRoom}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userRoom}`);
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/analytics", analyticRoutes);
app.use("/api/cart", cartRoutes);
app.get("/users", protect, authorize("admin"), async (req, res, next) =>  {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.use(notFound);
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}/users`);
});
