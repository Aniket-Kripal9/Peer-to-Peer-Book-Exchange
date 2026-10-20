import Request from "../models/Request.js";
import Book from "../models/Book.js";

// GET /api/requests
// Optional query: ?status=Pending&ownerName=...&requesterName=...
export const getRequests = async (req, res) => {
  try {
    const { status, ownerName, requesterName } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (ownerName) filter.ownerName = ownerName;
    if (requesterName) filter.requesterName = requesterName;

    const requests = await Request.find(filter)
      .populate("book", "title author category condition available image")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch requests", error: error.message });
  }
};

// GET /api/requests/:id
export const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate(
      "book",
      "title author category condition available image ownerName",
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(request);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch request", error: error.message });
  }
};

// POST /api/requests
// Body: { book, requesterName, requesterDepartment, requesterSemester, ownerName }
export const createRequest = async (req, res) => {
  try {
    const {
      book: bookId,
      requesterName,
      requesterDepartment,
      requesterSemester,
      ownerName,
    } = req.body;

    if (!bookId || !requesterName || !ownerName) {
      return res.status(400).json({
        message: "book, requesterName, and ownerName are required",
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.available) {
      return res
        .status(400)
        .json({ message: "This book is no longer available for exchange" });
    }

    // Prevent duplicate pending request for same book + requester
    const existing = await Request.findOne({
      book: bookId,
      requesterName,
      status: "Pending",
    });

    if (existing) {
      return res.status(400).json({
        message: "You already have a pending request for this book",
      });
    }

    const request = await Request.create({
      book: bookId,
      requesterName,
      requesterDepartment: requesterDepartment || "",
      requesterSemester: requesterSemester || "",
      ownerName,
      status: "Pending",
    });

    const populated = await Request.findById(request._id).populate(
      "book",
      "title author category condition available image",
    );

    res.status(201).json(populated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create request", error: error.message });
  }
};

// PUT /api/requests/:id
// Body: { status: 'Accepted' | 'Rejected' | 'Pending' }
export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Pending, Accepted, or Rejected",
      });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    // If accepted → mark the book as unavailable
    if (status === "Accepted") {
      await Book.findByIdAndUpdate(request.book, { available: false });
    }

    // If rejected/pending again and book was locked by this accept, you may
    // choose to re-open it. For student MVP we only lock on Accept.
    // (Optional enhancement later)

    const populated = await Request.findById(request._id).populate(
      "book",
      "title author category condition available image",
    );

    res.status(200).json(populated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update request", error: error.message });
  }
};

// DELETE /api/requests/:id
export const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete request", error: error.message });
  }
};
