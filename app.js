import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import connectToDb from "./db.js";

// Import routes
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import mapRoutes from "./routes/maps.routes.js";
import priceRoutes from "./routes/price.routes.js";
import chatsRoutes from "./routes/chats.routes.js";
import helpRoutes from "./routes/help.routes.js";

const app = express();

// Connect to MongoDB
connectToDb();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve uploaded images

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

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/maps", mapRoutes);
app.use("/api/v1/prices", priceRoutes);
app.use("/api/v1/chats", chatsRoutes);
app.use("/api/v1/help", helpRoutes);
// 404 Error Handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
