import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "./models/Book.js";
import Request from "./models/Request.js";

dotenv.config();

const seedRequests = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    const books = await Book.find().limit(6);
    if (books.length < 4) {
      console.log("❌ Not enough books. Run npm run seed first.");
      process.exit(1);
    }

    await Request.deleteMany({});
    console.log("🧹 Cleared existing requests");

    const sample = [
      {
        book: books[0]._id,
        requesterName: "Neha Kapoor",
        requesterDepartment: "CSE",
        requesterSemester: "4th",
        ownerName: books[0].ownerName,
        status: "Pending",
      },
      {
        book: books[1]._id,
        requesterName: "Arjun Desai",
        requesterDepartment: "ECE",
        requesterSemester: "3rd",
        ownerName: books[1].ownerName,
        status: "Pending",
      },
      {
        book: books[2]._id,
        requesterName: "Sanya Bhatia",
        requesterDepartment: "IT",
        requesterSemester: "5th",
        ownerName: books[2].ownerName,
        status: "Accepted",
      },
      {
        book: books[3]._id,
        requesterName: "Devansh Kulkarni",
        requesterDepartment: "ME",
        requesterSemester: "2nd",
        ownerName: books[3].ownerName,
        status: "Rejected",
      },
    ];

    // If a request is Accepted, mark that book unavailable
    for (const item of sample) {
      const reqDoc = await Request.create(item);
      if (item.status === "Accepted") {
        await Book.findByIdAndUpdate(item.book, { available: false });
      }
      console.log(`➕ Request created: ${reqDoc._id} (${item.status})`);
    }

    console.log("✅ Sample requests seeded");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed requests failed:", error);
    process.exit(1);
  }
};

seedRequests();
