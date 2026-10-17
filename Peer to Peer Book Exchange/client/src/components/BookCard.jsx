import React from "react";
import { Link } from "react-router-dom";

function BookCard({ book }) {
  // Condition badge color mapping
  const conditionColors = {
    New: "bg-success",
    "Like New": "bg-info",
    Good: "bg-primary",
    Fair: "bg-warning text-dark",
    Poor: "bg-danger",
  };

  return (
    <div className="col">
      <div className="card card-custom h-100 d-flex flex-column">
        {/* Book Image */}
        <div className="book-image-wrapper">
          <img
            src={
              book.image || "https://via.placeholder.com/300x400?text=No+Image"
            }
            className="card-img-top book-image"
            alt={book.title}
          />
          {/* Availability Badge */}
          <span
            className={`badge position-absolute top-0 end-0 m-2 ${
              book.available ? "bg-success" : "bg-secondary"
            }`}
          >
            {book.available ? "Available" : "Exchanged"}
          </span>
        </div>

        {/* Book Info */}
        <div className="card-body d-flex flex-column">
          <h6 className="card-title fw-bold mb-1 text-truncate">
            {book.title}
          </h6>
          <p className="card-text text-muted small mb-2">by {book.author}</p>

          {/* Badges */}
          <div className="mb-3">
            <span className="badge bg-light text-dark border me-1">
              {book.category}
            </span>
            <span
              className={`badge ${conditionColors[book.condition] || "bg-secondary"}`}
            >
              {book.condition}
            </span>
          </div>

          {/* View Details Button — pushed to bottom */}
          <div className="mt-auto">
            <Link
              to={`/books/${book._id}`}
              className="btn btn-sm btn-primary-custom w-100"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
