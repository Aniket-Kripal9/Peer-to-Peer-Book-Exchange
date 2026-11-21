import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBookById, createRequest, getCurrentUser } from '../api';

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBookById(id);
        if (!data) {
          setError('Book not found.');
        } else {
          setBook(data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load book details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleRequestExchange = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.email === book.ownerEmail) {
      setError('You cannot request your own book.');
      return;
    }

    setError('');
    setSuccessMsg('');
    setRequestLoading(true);

    try {
      // Send proper structured payload object expected by backend
      await createRequest({
        bookId: book._id,
        bookTitle: book.title,
        ownerName: book.ownerName,
        ownerEmail: book.ownerEmail,
        requesterName: currentUser.name,
      });

      // ONLY show success if request actually succeeded
      setSuccessMsg('Exchange request sent successfully!');
    } catch (err) {
      // Show server error instead of falsely showing success
      setError(err.message || 'Failed to send exchange request.');
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading book details...</p>
      </div>
    );
  }

  if (error && !book) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
        <Link to="/books" className="btn btn-outline-primary">Back to Browse Books</Link>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ minHeight: '80vh' }}>
      <Link to="/books" className="btn btn-outline-secondary mb-4 btn-sm">
        &larr; Back to Browse Books
      </Link>

      {error && <div className="alert alert-danger alert-dismissible">{error}</div>}
      {successMsg && <div className="alert alert-success alert-dismissible">{successMsg}</div>}

      <div className="card shadow-sm border-0 p-4">
        <div className="row g-4">
          <div className="col-md-4 text-center">
            <img
              src={book.image || 'https://via.placeholder.com/300x400?text=No+Cover'}
              alt={book.title}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: '380px', width: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover';
              }}
            />
          </div>

          <div className="col-md-8">
            <span className="badge bg-secondary mb-2">{book.category}</span>
            <h2 className="fw-bold" style={{ color: '#2c3e50' }}>{book.title}</h2>
            <p className="text-muted fs-5 mb-3">by {book.author}</p>

            <div className="mb-4">
              <h5 className="fw-semibold">Description</h5>
              <p className="text-secondary">{book.description || 'No description provided.'}</p>
            </div>

            <div className="p-3 bg-light rounded mb-4">
              <p className="mb-1"><strong>Owner:</strong> {book.ownerName}</p>
              <p className="mb-0"><strong>Contact Email:</strong> {book.ownerEmail}</p>
            </div>

            {currentUser && currentUser.email === book.ownerEmail ? (
              <div className="alert alert-info py-2">
                This is your listing. You can manage it from your <Link to="/dashboard">Dashboard</Link>.
              </div>
            ) : (
              <button
                className="btn btn-primary btn-lg px-4"
                onClick={handleRequestExchange}
                disabled={requestLoading || !!successMsg}
              >
                {requestLoading ? 'Sending Request...' : successMsg ? 'Request Sent' : 'Request Exchange'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetailPage;