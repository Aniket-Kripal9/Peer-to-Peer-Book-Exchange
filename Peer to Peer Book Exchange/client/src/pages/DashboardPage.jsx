import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getBooks,
  getRequests,
  updateRequestStatus,
  deleteBook,
  deleteRequest,
  getCurrentUser,
} from '../api';
import BookCard from '../components/BookCard';
import RequestCard from '../components/RequestCard';

function DashboardPage() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [myListings, setMyListings] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('listings');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadDashboardData() {
      try {
        const user = getCurrentUser();
        if (!cancelled) {
          setCurrentUser(user);
        }

        const [booksRes, requestsRes] = await Promise.all([
          getBooks(),
          getRequests(),
        ]);

        if (cancelled) return;

        // Defensive normalization to arrays
        const allBooks = Array.isArray(booksRes)
          ? booksRes
          : booksRes?.books && Array.isArray(booksRes.books)
          ? booksRes.books
          : [];

        const allRequests = Array.isArray(requestsRes)
          ? requestsRes
          : requestsRes?.requests && Array.isArray(requestsRes.requests)
          ? requestsRes.requests
          : [];

        const userName = user?.name || '';

        // Filter for My Listings (books owned by logged-in user)
        const listings = allBooks.filter(
          (book) =>
            book.ownerName &&
            book.ownerName.toLowerCase() === userName.toLowerCase()
        );

        // Filter for My Requests (requests sent by logged-in user)
        const myReqs = allRequests.filter(
          (req) =>
            req.requesterName &&
            req.requesterName.toLowerCase() === userName.toLowerCase()
        );

        // Filter for Incoming Requests (requests received for user's books)
        const incomingReqs = allRequests.filter(
          (req) =>
            req.ownerName &&
            req.ownerName.toLowerCase() === userName.toLowerCase()
        );

        setMyListings(listings);
        setMyRequests(myReqs);
        setIncomingRequests(incomingReqs);
        setError('');
      } catch (err) {
        console.error('Error loading dashboard:', err);
        if (!cancelled) {
          setError('Failed to load dashboard data. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await updateRequestStatus(requestId, 'Accepted');
      window.location.reload();
    } catch (err) {
      alert('Failed to accept request: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (requestId) => {
    try {
      await updateRequestStatus(requestId, 'Rejected');
      window.location.reload();
    } catch (err) {
      alert('Failed to reject request: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteListing = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await deleteBook(bookId);
      setMyListings((prev) => prev.filter((b) => b._id !== bookId));
    } catch (err) {
      alert('Failed to delete book: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteMyRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      await deleteRequest(requestId);
      setMyRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      alert('Failed to delete request: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--primary-color)' }}>
            My Dashboard
          </h2>
          <p className="text-muted small mb-0">
            Logged in as <strong>{currentUser?.name || 'Student'}</strong> (
            {currentUser?.department || 'CSE'}, {currentUser?.semester || '6th'} Semester)
          </p>
        </div>
        <Link to="/add-book" className="btn btn-primary fw-semibold">
          <i className="bi bi-plus-lg me-1"></i> Add New Book
        </Link>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4 border-bottom">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'listings' ? 'active fw-bold' : 'text-secondary'}`}
            onClick={() => setActiveTab('listings')}
          >
            <i className="bi bi-journal-text me-2"></i>
            My Listings{' '}
            <span className="badge bg-primary rounded-pill ms-1">{myListings.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'myRequests' ? 'active fw-bold' : 'text-secondary'}`}
            onClick={() => setActiveTab('myRequests')}
          >
            <i className="bi bi-send me-2"></i>
            My Requests{' '}
            <span className="badge bg-secondary rounded-pill ms-1">{myRequests.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'incomingRequests' ? 'active fw-bold' : 'text-secondary'}`}
            onClick={() => setActiveTab('incomingRequests')}
          >
            <i className="bi bi-inbox me-2"></i>
            Incoming Requests{' '}
            <span className="badge bg-warning text-dark rounded-pill ms-1">
              {incomingRequests.length}
            </span>
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab === 'listings' && (
        <div>
          {myListings.length > 0 ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {myListings.map((book) => (
                <div className="col" key={book._id}>
                  <div className="position-relative">
                    <BookCard book={book} />
                    <div className="mt-2 d-flex gap-2">
                      <Link
                        to={`/edit-book/${book._id}`}
                        className="btn btn-sm btn-outline-secondary w-50"
                      >
                        <i className="bi bi-pencil me-1"></i> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(book._id)}
                        className="btn btn-sm btn-outline-danger w-50"
                      >
                        <i className="bi bi-trash me-1"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 bg-white rounded-3 shadow-sm p-4">
              <i className="bi bi-journal-x fs-1 text-muted"></i>
              <h5 className="fw-bold mt-2">You haven't listed any books yet</h5>
              <p className="text-muted small mb-3">
                Add a book with your name as owner to see it here.
              </p>
              <Link to="/add-book" className="btn btn-primary btn-sm px-4">
                Add a Book
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'myRequests' && (
        <div>
          {myRequests.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 g-3">
              {myRequests.map((req) => (
                <div className="col" key={req._id}>
                  <RequestCard
                    request={req}
                    isIncoming={false}
                    onDelete={() => handleDeleteMyRequest(req._id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 bg-white rounded-3 shadow-sm p-4">
              <i className="bi bi-send-x fs-1 text-muted"></i>
              <h5 className="fw-bold mt-2">No outgoing exchange requests</h5>
              <p className="text-muted small mb-3">
                Browse available books and send requests to fellow students.
              </p>
              <Link to="/books" className="btn btn-primary btn-sm px-4">
                Browse Books
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'incomingRequests' && (
        <div>
          {incomingRequests.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 g-3">
              {incomingRequests.map((req) => (
                <div className="col" key={req._id}>
                  <RequestCard
                    request={req}
                    isIncoming={true}
                    onAccept={() => handleAccept(req._id)}
                    onReject={() => handleReject(req._id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 bg-white rounded-3 shadow-sm p-4">
              <i className="bi bi-inbox-fill fs-1 text-muted"></i>
              <h5 className="fw-bold mt-2">No incoming requests yet</h5>
              <p className="text-muted small mb-0">
                When another student requests one of your listed books, it will appear here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;