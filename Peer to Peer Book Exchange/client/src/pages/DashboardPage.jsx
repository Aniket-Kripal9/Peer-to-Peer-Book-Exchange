import { useState } from "react";
import { Link } from "react-router-dom";
import RequestCard from "../components/RequestCard";

// ---------- Dummy data (will be replaced with API calls later) ----------
// Book IDs reuse the sample books so the "View" links open real detail pages.

const initialListings = [
  {
    _id: "1",
    title: "Data Structures and Algorithms",
    author: "Cormen, Leiserson",
    category: "Computer Science",
    condition: "Good",
    available: true,
  },
  {
    _id: "4",
    title: "Introduction to Psychology",
    author: "Robert Feldman",
    category: "Humanities",
    condition: "New",
    available: false,
  },
  {
    _id: "5",
    title: "Operating System Concepts",
    author: "Silberschatz, Galvin",
    category: "Computer Science",
    condition: "Good",
    available: true,
  },
  {
    _id: "6",
    title: "University Physics",
    author: "Young & Freedman",
    category: "Physics",
    condition: "Like New",
    available: true,
  },
];

// Requests I have sent to other students
const initialMyRequests = [
  {
    _id: "m1",
    book: { _id: "2", title: "Engineering Mathematics", author: "B.S. Grewal" },
    owner: { name: "Sara Khan", department: "EE", semester: "4th" },
    status: "Pending",
    requestedDate: "2025-02-14",
  },
  {
    _id: "m2",
    book: { _id: "3", title: "Organic Chemistry", author: "Morrison & Boyd" },
    owner: { name: "Usman Tariq", department: "Chem", semester: "5th" },
    status: "Accepted",
    requestedDate: "2025-02-08",
  },
  {
    _id: "m3",
    book: {
      _id: "7",
      title: "Principles of Economics",
      author: "N. Gregory Mankiw",
    },
    owner: { name: "Bilal Sheikh", department: "BBA", semester: "4th" },
    status: "Rejected",
    requestedDate: "2025-02-02",
  },
];

// Requests other students have sent for my books
const initialIncomingRequests = [
  {
    _id: "i1",
    book: {
      _id: "1",
      title: "Data Structures and Algorithms",
      author: "Cormen, Leiserson",
    },
    requester: { name: "Maryam Iqbal", department: "CS", semester: "5th" },
    status: "Pending",
    requestedDate: "2025-02-12",
  },
  {
    _id: "i2",
    book: {
      _id: "5",
      title: "Operating System Concepts",
      author: "Silberschatz, Galvin",
    },
    requester: { name: "Daniyal Shah", department: "SE", semester: "6th" },
    status: "Pending",
    requestedDate: "2025-02-13",
  },
  {
    _id: "i3",
    book: {
      _id: "4",
      title: "Introduction to Psychology",
      author: "Robert Feldman",
    },
    requester: { name: "Hira Baig", department: "Psych", semester: "3rd" },
    status: "Accepted",
    requestedDate: "2025-01-05",
  },
  {
    _id: "i4",
    book: { _id: "6", title: "University Physics", author: "Young & Freedman" },
    requester: { name: "Omar Farooq", department: "Phys", semester: "2nd" },
    status: "Rejected",
    requestedDate: "2025-02-06",
  },
];

// Small reusable empty-state block
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

function DashboardPage() {
  const [activeTab, setActiveTab] = useState("listings");
  const [myListings, setMyListings] = useState(initialListings);
  const [myRequests, setMyRequests] = useState(initialMyRequests);
  const [incomingRequests, setIncomingRequests] = useState(
    initialIncomingRequests,
  );

  const pendingIncomingCount = incomingRequests.filter(
    (r) => r.status === "Pending",
  ).length;

  // ----- My Listings handlers -----
  const handleToggleAvailability = (id) => {
    setMyListings((prev) =>
      prev.map((book) =>
        book._id === id ? { ...book, available: !book.available } : book,
      ),
    );
  };

  const handleDeleteListing = (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      setMyListings((prev) => prev.filter((book) => book._id !== id));
    }
  };

  // ----- My Requests handlers -----
  const handleCancelRequest = (id) => {
    if (window.confirm("Cancel this exchange request?")) {
      setMyRequests((prev) => prev.filter((req) => req._id !== id));
    }
  };

  // ----- Incoming Requests handlers -----
  const handleIncomingDecision = (requestId, newStatus) => {
    const request = incomingRequests.find((r) => r._id === requestId);

    setIncomingRequests((prev) =>
      prev.map((r) => (r._id === requestId ? { ...r, status: newStatus } : r)),
    );

    // If accepted, the book is no longer available
    if (newStatus === "Accepted" && request) {
      setMyListings((prev) =>
        prev.map((book) =>
          book._id === request.book._id ? { ...book, available: false } : book,
        ),
      );
    }
  };

  return (
    <div className="container py-4">
      {/* Page Header */}
      <h2 className="section-title mb-1">My Dashboard</h2>
      <p className="text-muted mb-4">
        Manage your listings and keep track of your exchange requests.
      </p>

      {/* ===== Tabs ===== */}
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
            className={`nav-link ${activeTab === "myRequests" ? "active" : ""}`}
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

      {/* ===== TAB 1: My Listings ===== */}
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
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleToggleAvailability(book._id)}
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
              text="Add your first book and let other students find it."
            >
              <Link to="/add-book" className="btn btn-primary-custom">
                ➕ Add a Book
              </Link>
            </EmptyState>
          )}
        </div>
      )}

      {/* ===== TAB 2: My Requests ===== */}
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

      {/* ===== TAB 3: Incoming Requests ===== */}
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
              text="When someone requests one of your books, it will show up here."
            />
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
