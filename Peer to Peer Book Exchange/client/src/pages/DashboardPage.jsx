import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RequestCard from "../components/RequestCard";
import {
  getBooks,
  deleteBook,
  updateBook,
  getRequests,
  updateRequestStatus,
  deleteRequest,
  CURRENT_USER,
} from "../api";

function EmptyState({ icon, title, text, children }) {
  return (
    <div className="dashboard-panel text-center py-5">
      <div className="empty-state-icon mb-3">{icon}</div>
      <h5 className="fw-bold text-muted">{title}</h5>
      <p className="text-muted">{text}</p>
      {children}
    </div>
  );
}

function mapOutgoing(req) {
  return {
    _id: req._id,
    status: req.status,
    requestedDate: req.createdAt,
    book: {
      _id: req.book?._id || req.book,
      title: req.book?.title || "Unknown book",
      author: req.book?.author || "",
    },
    owner: {
      name: req.ownerName,
      department: "",
      semester: "",
    },
  };
}

function mapIncoming(req) {
  return {
    _id: req._id,
    status: req.status,
    requestedDate: req.createdAt,
    book: {
      _id: req.book?._id || req.book,
      title: req.book?.title || "Unknown book",
      author: req.book?.author || "",
    },
    requester: {
      name: req.requesterName,
      department: req.requesterDepartment || "",
      semester: req.requesterSemester || "",
    },
  };
}

function DashboardPage() {
  const [activeTab, setActiveTab] = useState("listings");
  const [myListings, setMyListings] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initial load — state updates happen asynchronously AFTER await
  useEffect(() => {
    let cancelled = false;

    const loadDashboardData = async () => {
      try {
        setError("");
        const [booksRes, outgoingRes, incomingRes] = await Promise.all([
          getBooks(),
          getRequests({ requesterName: CURRENT_USER.name }),
          getRequests({ ownerName: CURRENT_USER.name }),
        ]);

        if (!cancelled) {
          const mine = booksRes.data.filter(
            (b) => b.ownerName === CURRENT_USER.name,
          );
          setMyListings(mine);
          setMyRequests(outgoingRes.data.map(mapOutgoing));
          setIncomingRequests(incomingRes.data.map(mapIncoming));
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Could not load dashboard. Is the backend running?");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Helper function to re-fetch data after actions (delete, accept, reject)
  const refreshData = async () => {
    try {
      setError("");
      const [booksRes, outgoingRes, incomingRes] = await Promise.all([
        getBooks(),
        getRequests({ requesterName: CURRENT_USER.name }),
        getRequests({ ownerName: CURRENT_USER.name }),
      ]);

      const mine = booksRes.data.filter(
        (b) => b.ownerName === CURRENT_USER.name,
      );
      setMyListings(mine);
      setMyRequests(outgoingRes.data.map(mapOutgoing));
      setIncomingRequests(incomingRes.data.map(mapIncoming));
    } catch (err) {
      console.error(err);
      setError("Failed to refresh dashboard.");
    }
  };

  const pendingIncomingCount = incomingRequests.filter(
    (r) => r.status === "Pending",
  ).length;

  const handleToggleAvailability = async (id, current) => {
    try {
      await updateBook(id, { available: !current });
      await refreshData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update availability");
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Delete this listing permanently?")) return;
    try {
      await deleteBook(id);
      await refreshData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete listing");
    }
  };

  const handleCancelRequest = async (id) => {
    if (!window.confirm("Cancel this exchange request?")) return;
    try {
      await deleteRequest(id);
      await refreshData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel request");
    }
  };

  const handleIncomingDecision = async (requestId, newStatus) => {
    try {
      await updateRequestStatus(requestId, newStatus);
      await refreshData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update request");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="section-title mb-1">My Dashboard</h2>
      <p className="text-muted mb-4">
        Logged in as <strong>{CURRENT_USER.name}</strong> (mock user until auth
        is added).
      </p>

      {error && <div className="alert alert-warning">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-muted mt-2">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <ul className="nav nav-tabs dashboard-tabs mb-4">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === "listings" ? "active" : ""}`}
                onClick={() => setActiveTab("listings")}
              >
                📚 My Listings
                <span className="badge rounded-pill bg-secondary ms-2">
                  {myListings.length}
                </span>
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${
                  activeTab === "myRequests" ? "active" : ""
                }`}
                onClick={() => setActiveTab("myRequests")}
              >
                📤 My Requests
                <span className="badge rounded-pill bg-secondary ms-2">
                  {myRequests.length}
                </span>
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === "incoming" ? "active" : ""}`}
                onClick={() => setActiveTab("incoming")}
              >
                📥 Incoming Requests
                <span
                  className={`badge rounded-pill ms-2 ${
                    pendingIncomingCount > 0 ? "bg-danger" : "bg-secondary"
                  }`}
                >
                  {pendingIncomingCount > 0
                    ? `${pendingIncomingCount} new`
                    : incomingRequests.length}
                </span>
              </button>
            </li>
          </ul>

          {/* My Listings */}
          {activeTab === "listings" && (
            <div>
              {myListings.length > 0 ? (
                <div className="dashboard-panel">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Book</th>
                          <th>Category</th>
                          <th>Condition</th>
                          <th>Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myListings.map((book) => (
                          <tr key={book._id}>
                            <td>
                              <Link
                                to={`/books/${book._id}`}
                                className="fw-semibold text-decoration-none"
                              >
                                {book.title}
                              </Link>
                              <div className="small text-muted">
                                by {book.author}
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border">
                                {book.category}
                              </span>
                            </td>
                            <td>{book.condition}</td>
                            <td>
                              <span
                                className={`badge ${
                                  book.available ? "bg-success" : "bg-secondary"
                                }`}
                              >
                                {book.available ? "Available" : "Exchanged"}
                              </span>
                            </td>
                            <td className="text-end">
                              <div className="d-flex gap-2 justify-content-end flex-wrap">
                                <Link
                                  to={`/edit-book/${book._id}`}
                                  className="btn btn-sm btn-outline-secondary"
                                >
                                  ✏️ Edit
                                </Link>
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() =>
                                    handleToggleAvailability(
                                      book._id,
                                      book.available,
                                    )
                                  }
                                >
                                  {book.available
                                    ? "Mark Exchanged"
                                    : "Mark Available"}
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteListing(book._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon="📭"
                  title="You haven't listed any books yet"
                  text="Add a book with your name as owner to see it here."
                >
                  <Link to="/add-book" className="btn btn-primary-custom">
                    ➕ Add a Book
                  </Link>
                </EmptyState>
              )}
            </div>
          )}

          {/* My Requests */}
          {activeTab === "myRequests" && (
            <div>
              {myRequests.length > 0 ? (
                myRequests.map((req) => (
                  <RequestCard
                    key={req._id}
                    request={req}
                    type="outgoing"
                    onCancel={handleCancelRequest}
                  />
                ))
              ) : (
                <EmptyState
                  icon="📤"
                  title="No requests sent"
                  text="Browse books and request the ones you need."
                >
                  <Link to="/books" className="btn btn-primary-custom">
                    📚 Browse Books
                  </Link>
                </EmptyState>
              )}
            </div>
          )}

          {/* Incoming */}
          {activeTab === "incoming" && (
            <div>
              {incomingRequests.length > 0 ? (
                incomingRequests.map((req) => (
                  <RequestCard
                    key={req._id}
                    request={req}
                    type="incoming"
                    onAccept={(id) => handleIncomingDecision(id, "Accepted")}
                    onReject={(id) => handleIncomingDecision(id, "Rejected")}
                  />
                ))
              ) : (
                <EmptyState
                  icon="📥"
                  title="No incoming requests"
                  text="When someone requests your book, it will show up here."
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DashboardPage;
