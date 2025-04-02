import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import connectToDb from "./db.js";
import morganMiddleware from "./middlewares/loggingMiddleware.js";

// Import middleware
import { authUser, checkBanStatus } from "./middlewares/authMiddleware.js";
import isAdmin from "./middlewares/adminMiddleware.js";
import { setRequestTiming } from "./middlewares/timingMiddleware.js";

// Import routes
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import mapRoutes from "./routes/maps.routes.js";
import priceRoutes from "./routes/price.routes.js";
import helpRoutes from "./routes/help.routes.js";
import logRoutes from "./routes/logRoutes.js"; // Added log routes
import adminRoutes from "./routes/adminRoutes.js"; // Added admin routes

const app = express();

// Connect to MongoDB
connectToDb();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(morganMiddleware);
app.use(setRequestTiming); // Serve uploaded images

// Session & Passport Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes with proper route protection (authUser, checkBanStatus, isAdmin)
app.use("/api/v1/users", userRoutes); // User routes (protected)
app.use("/api/v1/auth", authUser, checkBanStatus, authRoutes); // Auth routes (protected)
app.use("/api/v1/maps", authUser, checkBanStatus, mapRoutes); // Map routes (protected)
app.use("/api/v1/prices", authUser, checkBanStatus, priceRoutes); // Price routes (protected)
app.use("/api/v1/help", helpRoutes); // Help routes (no protection needed)
app.use("/api/v1/admin", authUser, checkBanStatus, isAdmin, adminRoutes); // Admin routes (protected with admin check)
app.use("/api/v1/logs", authUser, checkBanStatus, logRoutes); // Log routes (protected)

// 404 Error Handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
