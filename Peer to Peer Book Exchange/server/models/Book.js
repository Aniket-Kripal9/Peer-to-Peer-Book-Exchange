import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    edition: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      enum: [
        "Computer Science",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Engineering",
        "Literature",
        "Humanities",
        "Business",
        "Other",
      ],
    },
    condition: {
      type: String,
      required: true,
      enum: ["New", "Like New", "Good", "Fair", "Poor"],
    },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    available: { type: Boolean, default: true },
    ownerName: { type: String, required: true },
    ownerDepartment: { type: String, default: "" },
    ownerSemester: { type: String, default: "" },
  },
  { timestamps: true }, // adds createdAt & updatedAt automatically
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
