import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBookById, createRequest, CURRENT_USER } from "../api";

const conditionColors = {
  New: "bg-success",
  "Like New": "bg-info",
  Good: "bg-primary",
  Fair: "bg-warning text-dark",
  Poor: "bg-danger",
};

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [requestMsg, setRequestMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchBook = async () => {
      try {
        const { data } = await getBookById(id);
        if (!cancelled) setBook(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Book not found or server error.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBook();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleRequest = async () => {
    if (!book) return;

    if (book.ownerName === CURRENT_USER.name) {
      setRequestMsg("⚠️ You cannot request your own book.");
      return;
    }

    try {
      setRequesting(true);
      setRequestMsg("");
      await createRequest({
        book: book._id,
        requesterName: CURRENT_USER.name,
        requesterDepartment: CURRENT_USER.department,
        requesterSemester: CURRENT_USER.semester,
        ownerName: book.ownerName,
      });
      setRequestMsg("✅ Exchange request sent successfully!");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to send request. Try again.";
      setRequestMsg(`❌ ${msg}`);
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 text-muted">Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container text-center py-5">
        <div className="empty-state-icon mb-3">😕</div>
        <h4 className="fw-bold text-muted">Book Not Found</h4>
        <p className="text-muted">{error || "This book does not exist."}</p>
        <Link to="/books" className="btn btn-primary-custom mt-2">
          ← Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <button
        className="btn btn-link text-decoration-none p-0 mb-3 back-link"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="card card-custom p-0 overflow-hidden">
        <div className="row g-0">
          <div className="col-md-4">
            <div className="detail-image-wrapper">
              <img
                src={book.image || "https://picsum.photos/seed/nobook/400/550"}
                className="img-fluid h-100 w-100"
                alt={book.title}
                style={{ objectFit: "cover" }}
              />
              <span
                className={`badge position-absolute top-0 start-0 m-3 fs-6 ${
                  book.available ? "bg-success" : "bg-secondary"
                }`}
              >
                {book.available ? "✅ Available" : "❌ Exchanged"}
              </span>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card-body p-4">
              <h2 className="fw-bold mb-1">{book.title}</h2>
              <p className="text-muted fs-5 mb-3">by {book.author}</p>

              <div className="mb-4 d-flex flex-wrap gap-2">
                <span className="badge bg-light text-dark border fs-6 px-3 py-2">
                  📂 {book.category}
                </span>
                <span
                  className={`badge ${
                    conditionColors[book.condition] || "bg-secondary"
                  } fs-6 px-3 py-2`}
                >
                  📦 {book.condition}
                </span>
                {book.edition && (
                  <span className="badge bg-light text-dark border fs-6 px-3 py-2">
                    📘 {book.edition}
                  </span>
                )}
              </div>

              <h6 className="fw-bold mb-2">Description</h6>
              <p className="text-muted mb-4">{book.description}</p>

              <hr />

              <h6 className="fw-bold mb-2">Listed By</h6>
              <div className="d-flex align-items-center mb-3">
                <div className="owner-avatar me-3">
                  {(book.ownerName || "?").charAt(0)}
                </div>
                <div>
                  <p className="mb-0 fw-semibold">{book.ownerName}</p>
                  <small className="text-muted">
                    {book.ownerDepartment}
                    {book.ownerSemester
                      ? ` • ${book.ownerSemester} Semester`
                      : ""}
                  </small>
                </div>
              </div>

              <small className="text-muted d-block mb-4">
                Listed on{" "}
                {new Date(book.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </small>

              {requestMsg && (
                <div className="alert alert-info py-2">{requestMsg}</div>
              )}

              {book.available ? (
                <button
                  className="btn btn-primary-custom btn-lg w-100"
                  onClick={handleRequest}
                  disabled={requesting}
                >
                  {requesting ? "Sending..." : "🤝 Request Exchange"}
                </button>
              ) : (
                <button className="btn btn-secondary btn-lg w-100" disabled>
                  Already Exchanged
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
