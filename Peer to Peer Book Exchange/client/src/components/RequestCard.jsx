import { Link } from "react-router-dom";

// Status badge color mapping
const statusBadge = {
  Pending: "bg-warning text-dark",
  Accepted: "bg-success",
  Rejected: "bg-danger",
};

function RequestCard({ request, type, onAccept, onReject, onCancel }) {
  const isIncoming = type === "incoming";
  const isPending = request.status === "Pending";

  // Incoming → show who is requesting. Outgoing → show who owns the book.
  const person = isIncoming ? request.requester : request.owner;

  const formattedDate = new Date(request.requestedDate).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" },
  );

  // Message shown once a request is no longer pending
  const getStatusMessage = () => {
    if (isPending) return null;

    if (isIncoming) {
      return request.status === "Accepted"
        ? "You accepted this request. Meet up on campus to complete the exchange."
        : "You rejected this request.";
    }

    return request.status === "Accepted"
      ? "🎉 Your request was accepted! Meet up on campus to complete the exchange."
      : "Unfortunately, the owner declined this request.";
  };

  const statusMessage = getStatusMessage();

  return (
    <div className={`request-card status-${request.status.toLowerCase()} mb-3`}>
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
        {/* Left: Person avatar + book & request info */}
        <div className="d-flex align-items-start">
          <div className="owner-avatar avatar-sm me-3">
            {person.name.charAt(0)}
          </div>
          <div>
            <Link
              to={`/books/${request.book._id}`}
              className="fw-bold text-decoration-none"
            >
              {request.book.title}
            </Link>
            <div className="small text-muted">by {request.book.author}</div>

            <div className="small mt-2">
              {isIncoming ? "Requested by " : "Owner: "}
              <strong>{person.name}</strong>
              <span className="text-muted">
                {" "}
                • {person.department} • {person.semester} Semester
              </span>
            </div>
            <div className="small text-muted">Requested on {formattedDate}</div>
          </div>
        </div>

        {/* Right: Status badge + action buttons */}
        <div className="text-md-end">
          <div className="mb-2">
            <span className={`badge ${statusBadge[request.status]}`}>
              {request.status}
            </span>
          </div>

          {/* Incoming + Pending → Accept / Reject */}
          {isIncoming && isPending && (
            <div className="d-flex gap-2 justify-content-md-end">
              <button
                className="btn btn-success btn-sm"
                onClick={() => onAccept(request._id)}
              >
                ✔ Accept
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => onReject(request._id)}
              >
                ✖ Reject
              </button>
            </div>
          )}

          {/* Outgoing + Pending → Cancel */}
          {!isIncoming && isPending && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => onCancel(request._id)}
            >
              Cancel Request
            </button>
          )}
        </div>
      </div>

      {/* Bottom: status message (only after a decision) */}
      {statusMessage && (
        <div className="request-message small mt-3">{statusMessage}</div>
      )}
    </div>
  );
}

export default RequestCard;
