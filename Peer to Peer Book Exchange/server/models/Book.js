import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    condition: {
      type: String,
      default: 'Good',
    },
    edition: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    ownerName: {
      type: String,
      required: true,
    },
    ownerEmail: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300x400?text=No+Cover',
    },
    status: {
      type: String,
      enum: ['Available', 'Exchanged'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);
export default Book;