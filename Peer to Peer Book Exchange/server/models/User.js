import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: 'CSE',
    },
    semester: {
      type: String,
      default: '6th',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);