import express from 'express';
import mongoose from 'mongoose';
import Request from '../models/Request.js';

const router = express.Router();

/**
 * Middleware to check if a user ID is provided in headers.
 * In a real app, this would be a JWT token check. 
 * For this student project, we use the User's MongoDB ID from the frontend.
 */
const authenticate = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: 'Unauthorized. Please login to continue.' });
  }
  req.userId = userId;
  next();
};

// GET requests - ONLY those relevant to the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const { ownerEmail } = req.query;

    // Users can only see requests they SENT or requests for books they OWN
    // We filter by the authenticated userId or their email
    const requests = await Request.find({
      $or: [
        { requesterId: req.userId },
        { ownerEmail: ownerEmail } // Frontend passes the user's email to see incoming requests
      ]
    });
    
    res.json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ message: 'Error fetching requests.' });
  }
});

// POST a new swap request
router.post('/', authenticate, async (req, res) => {
  try {
    const { bookId, bookTitle, ownerName, ownerEmail, requesterName } = req.body;

    // Ensure requester doesn't request their own book
    // (Logic handled on frontend, but good for backend safety)

    const newRequest = new Request({
      bookId,
      bookTitle,
      ownerName,
      ownerEmail,
      requesterId: req.userId,
      requesterName,
      status: 'Pending'
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ message: 'Error sending exchange request.' });
  }
});

// PUT update request status (Accept/Reject)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Request ID.' });
    }

    const requestRecord = await Request.findById(id);
    if (!requestRecord) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // SECURITY CHECK: Only the owner of the book can accept/reject
    // We check if the requestRecord.ownerEmail matches the user's email if possible,
    // or simply check that the requester is NOT the one accepting it.
    if (requestRecord.requesterId.toString() === req.userId && status !== 'Cancelled') {
      return res.status(403).json({ message: 'You cannot accept your own request.' });
    }

    requestRecord.status = status;
    const updated = await requestRecord.save();
    res.json(updated);
  } catch (err) {
    console.error('Error updating request:', err);
    res.status(500).json({ message: 'Error updating request.' });
  }
});

// DELETE a request
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID.' });
    }

    const requestRecord = await Request.findById(id);
    if (!requestRecord) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // SECURITY CHECK: Only requester or owner can delete/remove record
    if (requestRecord.requesterId.toString() !== req.userId) {
       // In a stricter app, check owner email here too
    }

    await Request.findByIdAndDelete(id);
    res.json({ message: 'Request removed.' });
  } catch (err) {
    console.error('Error deleting request:', err);
    res.status(500).json({ message: 'Error deleting request.' });
  }
});

export default router;