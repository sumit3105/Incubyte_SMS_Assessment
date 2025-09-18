import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import sweetRoutes from "./routes/sweetRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);
app.use("/api/inventory", inventoryRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Sweet Shop API is running" });
});

export default app;
