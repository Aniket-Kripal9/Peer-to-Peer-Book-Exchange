import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBookById, createRequest, deleteBook, getCurrentUser } from '../api';

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [requestSending, setRequestSending] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchBook() {
      setLoading(true);
      try {
        const user = getCurrentUser();
        if (!cancelled) setCurrentUser(user);

        const data = await getBookById(id);

        if (!cancelled) {
          // Normalize response: handle both direct book object and nested { book: {...} }
          if (data && (data._id || data.title)) {
            setBook(data);
          } else if (data && data.book) {
            setBook(data.book);
          } else {
            setBook(null);
          }
          setError('');
        }
      } catch (err) {
        console.error('Error loading book details:', err);
        if (!cancelled) {
          setError(err.response?.data?.message || 'Failed to load book details.');
          setBook(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      fetchBook();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleRequestExchange = async () => {
    if (!book) return;
    setRequestSending(true);
    setError('');

    try {
      await createRequest(book._id, book.ownerName);
      setRequestSuccess(true);
    } catch (err) {
      console.error('Error creating request:', err);
      setError(err.response?.data?.message || 'Failed to send exchange request.');
    } finally {
      setRequestSending(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!window.confirm('Are you sure you want to delete this book listing?')) return;

    try {
      await deleteBook(book._id);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to delete book: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading book details...</span>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5 bg-white rounded-3 shadow-sm p-4 col-md-6 mx-auto">
          <i className="bi bi-exclamation-triangle fs-1 text-warning"></i>
          <h3 className="fw-bold mt-3" style={{ color: 'var(--primary-color)' }}>
            Book Not Found
          </h3>
          <p className="text-muted small mb-4">
            {error || 'This book listing does not exist or has been removed.'}
          </p>
          <Link to="/books" className="btn btn-primary fw-semibold px-4">
            &larr; Back to Browse Books
          </Link>
        </div>
      </div>
    );
  }

  const isOwner =
    currentUser?.name &&
    book?.ownerName &&
    currentUser.name.toLowerCase() === book.ownerName.toLowerCase();

  return (
    <div className="container py-5">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/home">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/books">Books</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {book.title}
          </li>
        </ol>
      </nav>

      <div className="card shadow-sm border-0 overflow-hidden">
        <div className="row g-0">
          {/* Book Image */}
          <div className="col-md-5 bg-light d-flex align-items-center justify-content-center p-4">
            <img
              src={
                book.image ||
                `https://picsum.photos/seed/${book._id || 'book'}/400/550`
              }
              alt={book.title}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: '420px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://picsum.photos/seed/fallback/400/550';
              }}
            />
          </div>

          {/* Book Details */}
          <div className="col-md-7 p-4 p-md-5 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="badge bg-secondary px-3 py-2 fw-normal">
                  {book.category || 'General'}
                </span>
                <span
                  className={`badge px-3 py-2 ${
                    book.available ? 'bg-success' : 'bg-danger'
                  }`}
                >
                  {book.available ? 'Available for Swap' : 'Exchanged'}
                </span>
              </div>

              <h2 className="fw-bold mb-2" style={{ color: 'var(--primary-color)' }}>
                {book.title}
              </h2>
              <p className="fs-5 text-muted mb-3">by {book.author}</p>

              <hr />

              {/* Attributes Grid */}
              <div className="row g-3 my-2">
                <div className="col-6 col-sm-4">
                  <span className="text-muted small d-block">Edition</span>
                  <strong className="text-dark">{book.edition || 'N/A'}</strong>
                </div>
                <div className="col-6 col-sm-4">
                  <span className="text-muted small d-block">Condition</span>
                  <strong className="text-dark">{book.condition || 'Good'}</strong>
                </div>
                <div className="col-6 col-sm-4">
                  <span className="text-muted small d-block">Listed By</span>
                  <strong className="text-dark">
                    {book.ownerName || 'Student'} ({book.ownerDepartment || 'CSE'}, {book.ownerSemester || '6th'})
                  </strong>
                </div>
              </div>

              <hr />

              <div className="mb-4">
                <h6 className="fw-bold mb-2">Description</h6>
                <p className="text-muted leading-relaxed">
                  {book.description || 'No description provided for this book.'}
                </p>
              </div>
            </div>

            {/* Error / Success Alerts */}
            {error && <div className="alert alert-danger py-2 fs-6 mb-3">{error}</div>}

            {requestSuccess && (
              <div className="alert alert-success py-2 fs-6 mb-3">
                <i className="bi bi-check-circle-fill me-2"></i>
                Exchange request sent successfully! Track it in your{' '}
                <Link to="/dashboard" className="fw-bold">
                  Dashboard
                </Link>
                .
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2">
              {isOwner ? (
                <div className="d-flex gap-2">
                  <Link
                    to={`/edit-book/${book._id}`}
                    className="btn btn-outline-primary fw-semibold px-4"
                  >
                    <i className="bi bi-pencil me-1"></i> Edit Listing
                  </Link>
                  <button
                    onClick={handleDeleteBook}
                    className="btn btn-outline-danger fw-semibold px-4"
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              ) : book.available ? (
                <button
                  onClick={handleRequestExchange}
                  disabled={requestSending || requestSuccess}
                  className="btn btn-primary btn-lg fw-semibold px-4 w-100 w-sm-auto"
                >
                  {requestSending
                    ? 'Sending Request...'
                    : requestSuccess
                    ? 'Request Sent'
                    : 'Request Book Exchange'}
                </button>
              ) : (
                <button className="btn btn-secondary btn-lg fw-semibold px-4 disabled" disabled>
                  Currently Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetailPage;