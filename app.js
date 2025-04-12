import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectToDb from "./db.js";
import morganMiddleware from "./middlewares/loggingMiddleware.js";

// Import middleware
import { setRequestTiming } from "./middlewares/timingMiddleware.js";

// Import routes
import userRoutes from "./routes/user.routes.js";
import mapRoutes from "./routes/maps.routes.js";
import priceRoutes from "./routes/price.routes.js";
import helpRoutes from "./routes/help.routes.js";
import orderRoutes from "./routes/order.routes.js";
import addressRoutes from "./routes/address.routes.js";
import localmateRoutes from "./routes/localmate.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
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

app.use("/api/v1/users", userRoutes); // User routes
app.use("/api/v1/maps", mapRoutes); // Map routes
app.use("/api/v1/prices", priceRoutes); // Price routes
app.use("/api/v1/help", helpRoutes); // Help routes
app.use("/api/v1/orders", orderRoutes); // Order routes
app.use("/api/v1/addresses", addressRoutes); // Address routes
app.use("/api/v1/localmate", localmateRoutes); // Localmate routes
app.use("/api/v1/rating", ratingRoutes); // Rating routes
// 404 Error Handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
