import Book from "../models/Book.js";

// GET /api/books?search=&category=
export const getBooks = async (req, res) => {
  try {
    const { search = "", category = "" } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch books", error: error.message });
  }
};

// GET /api/books/:id
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch book", error: error.message });
  }
};

// POST /api/books
export const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", error: error.message });
    }
    res
      .status(500)
      .json({ message: "Failed to create book", error: error.message });
  }
};

// PUT /api/books/:id
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update book", error: error.message });
  }
};

// DELETE /api/books/:id
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete book", error: error.message });
  }
};
