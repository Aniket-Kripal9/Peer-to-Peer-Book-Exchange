import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    requesterName: { type: String, required: true },
    requesterDepartment: { type: String, default: "" },
    requesterSemester: { type: String, default: "" },
    ownerName: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

const Request = mongoose.model("Request", requestSchema);

export default Request;
