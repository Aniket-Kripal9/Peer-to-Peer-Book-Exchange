import { Link } from 'react-router-dom';

function BookCard({ book }) {
  if (!book) return null;

  return (
    <div className="card h-100 shadow-sm border-0 book-card transition-all">
      <div
        className="d-flex align-items-center justify-content-center bg-light overflow-hidden rounded-top"
        style={{ height: '240px' }}
      >
        <img
          src={book.image || 'https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg'}
          alt={book.title}
          className="img-fluid"
          style={{ maxHeight: '220px', maxWidth: '90%', objectFit: 'contain' }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';
          }}
        />
      </div>

      <div className="card-body p-3 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className="badge bg-light text-dark border small fw-normal">
              {book.category}
            </span>
            <span
              className={`badge ${
                book.available ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger'
              } small`}
            >
              {book.available ? 'Available' : 'Exchanged'}
            </span>
          </div>

          <h6 className="card-title fw-bold mb-1 text-truncate" title={book.title}>
            {book.title}
          </h6>
          <p className="card-text text-muted small mb-2 text-truncate">
            by {book.author}
          </p>
        </div>

        <div className="pt-2 border-top mt-2">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted small">Condition:</span>
            <span className="fw-semibold small">{book.condition}</span>
          </div>
          <Link
            to={`/books/${book._id}`}
            className="btn btn-outline-primary btn-sm w-100 fw-semibold"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookCard;