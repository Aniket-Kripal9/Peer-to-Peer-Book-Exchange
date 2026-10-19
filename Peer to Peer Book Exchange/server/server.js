import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Check if MONGO_URI exists
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in server/.env file");
} else {
  // MongoDB Connection
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

// Test Route
app.get("/", (req, res) => {
  res.send("BookSwap Backend is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
