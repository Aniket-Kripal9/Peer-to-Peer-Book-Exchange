import express from 'express';
import mongoose from 'mongoose';
import Book from '../models/Book.js';

const router = express.Router();

// GET all books (with optional search/category filters)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Error fetching books' });
  }
});

// GET a single book by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check if ID format is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Book ID format.' });
    }

    const book = await Book.findById(id);

    // 2. Check if book exists
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.json(book);
  } catch (err) {
    console.error('Error fetching book:', err);
    res.status(500).json({ message: 'Server error fetching book details.' });
  }
});

// POST a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, category, description, ownerName, ownerEmail, image } = req.body;

    if (!title || !author || !ownerEmail) {
      return res.status(400).json({ message: 'Title, Author, and Owner Email are required.' });
    }

    const newBook = new Book({
      title,
      author,
      category: category || 'General',
      description,
      ownerName,
      ownerEmail,
      image: image || 'https://via.placeholder.com/150'
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    console.error('Error creating book:', err);
    res.status(500).json({ message: 'Error saving book.' });
  }
});

// PUT update a book
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Book ID format.' });
    }

    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.json(updatedBook);
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).json({ message: 'Error updating book.' });
  }
});

// DELETE a book
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Book ID format.' });
    }

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({ message: 'Error deleting book.' });
  }
});

export default router;