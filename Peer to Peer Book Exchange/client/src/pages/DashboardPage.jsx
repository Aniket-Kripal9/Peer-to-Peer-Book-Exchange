import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  getCurrentUser,
  getBooks,
  deleteBook,
  getRequests,
  updateRequestStatus,
  deleteRequest,
} from '../api';

function DashboardPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [myBooks, setMyBooks] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setErrorMsg('');

        const [booksData, requestsData] = await Promise.all([
          getBooks(),
          getRequests(currentUser.email),
        ]);

        const myListed = booksData.filter((b) => b.ownerEmail === currentUser.email);
        setMyBooks(myListed);

        const incoming = requestsData.filter((r) => r.ownerEmail === currentUser.email);
        const outgoing = requestsData.filter((r) => r.requesterId === currentUser._id);

        setIncomingRequests(incoming);
        setOutgoingRequests(outgoing);
      } catch (err) {
        setErrorMsg(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, navigate]);

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await deleteBook(bookId);
      // ONLY update UI if the backend deletion succeeds
      setMyBooks((prev) => prev.filter((b) => b._id !== bookId));
      setSuccessMsg('Book deleted successfully.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete book.');
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await updateRequestStatus(requestId, newStatus);
      // ONLY update UI if the backend update succeeds
      setIncomingRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: newStatus } : r))
      );
      setSuccessMsg(`Request marked as ${newStatus}.`);
    } catch (err) {
      setErrorMsg(err.message || `Failed to update request.`);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await deleteRequest(requestId);
      // ONLY update UI if the backend cancellation succeeds
      setOutgoingRequests((prev) => prev.filter((r) => r._id !== requestId));
      setSuccessMsg('Request cancelled successfully.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to cancel request.');
    }
  };

  if (!currentUser) return null;

  return (
    <div className="container py-4" style={{ minHeight: '80vh', maxWidth: '1000px' }}>
      {/* Header section matching screenshot */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>My Dashboard</h2>
          <p className="text-muted small mb-0">
            Logged in as <strong>{currentUser.name}</strong> ({currentUser.department || 'CSE'}, {currentUser.semester || '1st Semester'})
          </p>
        </div>
        <Link to="/add-book" className="btn btn-primary fw-semibold px-3">
          Add New Book
        </Link>
      </div>

      {/* Alerts */}
      {errorMsg && <div className="alert alert-danger alert-dismissible">{errorMsg}</div>}
      {successMsg && <div className="alert alert-success alert-dismissible">{successMsg}</div>}

      {/* Tab Navigation matching screenshot */}
      <div className="d-flex gap-2 mb-3">
        <button
          className={`btn btn-sm px-3 py-2 fw-semibold rounded-top ${
            activeTab === 'listings'
              ? 'bg-white text-dark shadow-sm border border-bottom-0'
              : 'text-muted border-0 bg-transparent'
          }`}
          onClick={() => setActiveTab('listings')}
        >
          My Listings{' '}
          <span className="badge bg-primary rounded-pill ms-1">{myBooks.length}</span>
        </button>

        <button
          className={`btn btn-sm px-3 py-2 fw-semibold rounded-top ${
            activeTab === 'requests'
              ? 'bg-white text-dark shadow-sm border border-bottom-0'
              : 'text-muted border-0 bg-transparent'
          }`}
          onClick={() => setActiveTab('requests')}
        >
          My Requests{' '}
          <span className="badge bg-secondary rounded-pill ms-1">{outgoingRequests.length}</span>
        </button>

        <button
          className={`btn btn-sm px-3 py-2 fw-semibold rounded-top ${
            activeTab === 'incoming'
              ? 'bg-white text-dark shadow-sm border border-bottom-0'
              : 'text-muted border-0 bg-transparent'
          }`}
          onClick={() => setActiveTab('incoming')}
        >
          Incoming Requests{' '}
          <span className="badge bg-warning text-dark rounded-pill ms-1">
            {incomingRequests.length}
          </span>
        </button>
      </div>

      {/* Main Tab Content Card */}
      {loading ? (
        <div className="card shadow-sm border text-center p-5">
          <div className="spinner-border text-primary mx-auto mb-2" role="status"></div>
          <p className="text-muted mb-0">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: My Listings */}
          {activeTab === 'listings' && (
            <div>
              {myBooks.length === 0 ? (
                <div className="card shadow-sm border text-center py-5 px-3">
                  <h5 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>
                    You haven't listed any books yet
                  </h5>
                  <p className="text-muted small mb-4">
                    Add a book with your account to see it here.
                  </p>
                  <div>
                    <Link to="/add-book" className="btn btn-primary px-4 fw-semibold">
                      Add a Book
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="row g-4">
                  {myBooks.map((book) => (
                    <div className="col-12 col-md-6 col-lg-4" key={book._id}>
                      <div className="card h-100 shadow-sm border">
                        <img
                          src={book.image || 'https://via.placeholder.com/300x400?text=No+Cover'}
                          alt={book.title}
                          className="card-img-top"
                          style={{ height: '200px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover';
                          }}
                        />
                        <div className="card-body d-flex flex-column">
                          <span className="badge bg-secondary mb-2 align-self-start">{book.category}</span>
                          <h6 className="card-title fw-bold text-truncate mb-1">{book.title}</h6>
                          <p className="card-text text-muted small mb-2">by {book.author}</p>
                          <div className="d-flex gap-2 mt-auto pt-2 border-top">
                            <Link to={`/edit-book/${book._id}`} className="btn btn-sm btn-outline-primary w-50">
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteBook(book._id)}
                              className="btn btn-sm btn-outline-danger w-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: My Requests (Sent) */}
          {activeTab === 'requests' && (
            <div>
              {outgoingRequests.length === 0 ? (
                <div className="card shadow-sm border text-center py-5 px-3">
                  <h5 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>
                    You haven't requested any books yet
                  </h5>
                  <p className="text-muted small mb-4">
                    Browse available books and send exchange requests to get started.
                  </p>
                  <div>
                    <Link to="/books" className="btn btn-primary px-4 fw-semibold">
                      Browse Books
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="row g-3">
                  {outgoingRequests.map((req) => (
                    <div className="col-12 col-md-6" key={req._id}>
                      <div className="card shadow-sm border p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="fw-bold mb-1">{req.bookTitle}</h6>
                            <p className="text-muted small mb-0">Owner: {req.ownerName} ({req.ownerEmail})</p>
                          </div>
                          <span
                            className={`badge ${
                              req.status === 'Accepted'
                                ? 'bg-success'
                                : req.status === 'Rejected'
                                ? 'bg-danger'
                                : 'bg-warning text-dark'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                        {req.status === 'Pending' && (
                          <div className="mt-2 pt-2 border-top text-end">
                            <button
                              onClick={() => handleCancelRequest(req._id)}
                              className="btn btn-sm btn-outline-secondary"
                            >
                              Cancel Request
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Incoming Requests */}
          {activeTab === 'incoming' && (
            <div>
              {incomingRequests.length === 0 ? (
                <div className="card shadow-sm border text-center py-5 px-3">
                  <h5 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>
                    No incoming requests yet
                  </h5>
                  <p className="text-muted small mb-0">
                    When another student requests one of your books, it will appear here.
                  </p>
                </div>
              ) : (
                <div className="row g-3">
                  {incomingRequests.map((req) => (
                    <div className="col-12 col-md-6" key={req._id}>
                      <div className="card shadow-sm border p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="fw-bold mb-1">{req.bookTitle}</h6>
                            <p className="text-muted small mb-0">Requested by: {req.requesterName}</p>
                          </div>
                          <span
                            className={`badge ${
                              req.status === 'Accepted'
                                ? 'bg-success'
                                : req.status === 'Rejected'
                                ? 'bg-danger'
                                : 'bg-warning text-dark'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                        {req.status === 'Pending' ? (
                          <div className="d-flex gap-2 mt-3 pt-2 border-top">
                            <button
                              onClick={() => handleUpdateStatus(req._id, 'Accepted')}
                              className="btn btn-sm btn-success w-50"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req._id, 'Rejected')}
                              className="btn btn-sm btn-outline-danger w-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <p className="text-muted small mb-0 mt-2 pt-2 border-top">
                            Request marked as {req.status}.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DashboardPage;