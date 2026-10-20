import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bookRoutes from "./routes/books.js";
import requestRoutes from "./routes/requests.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Check MONGO_URI
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in server/.env file");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

// Test Route
app.get("/", (req, res) => {
  res.send("BookSwap Backend is running...");
});

// API Routes
app.use("/api/books", bookRoutes);
app.use("/api/requests", requestRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
