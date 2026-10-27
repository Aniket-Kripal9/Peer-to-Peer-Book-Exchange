import { Link } from 'react-router-dom';

function RequestCard({ request, isIncoming, onAccept, onReject, onDelete }) {
  if (!request) return null;

  // Safely extract book details (handles both populated book objects and unpopulated IDs)
  const isBookObject = typeof request.book === 'object' && request.book !== null;
  const bookTitle = isBookObject ? request.book?.title : 'Book Request';
  const bookAuthor = isBookObject ? request.book?.author : '';
  const bookId = isBookObject ? request.book?._id : request.book;

  const requesterName = request.requesterName || 'Student';
  const requesterDept = request.requesterDepartment || 'CSE';
  const requesterSem = request.requesterSemester || '6th';

  const ownerName = request.ownerName || 'Student';
  const status = request.status || 'Pending';

  const statusBadgeClass =
    status === 'Accepted'
      ? 'bg-success'
      : status === 'Rejected'
      ? 'bg-danger'
      : 'bg-warning text-dark';

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-4 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h6 className="fw-bold mb-1" style={{ color: 'var(--primary-color)' }}>
                {bookId ? (
                  <Link to={`/books/${bookId}`} className="text-decoration-none text-dark">
                    {bookTitle}
                  </Link>
                ) : (
                  bookTitle
                )}
              </h6>
              {bookAuthor && <p className="text-muted small mb-0">by {bookAuthor}</p>}
            </div>
            <span className={`badge ${statusBadgeClass} px-3 py-2 fw-semibold`}>
              {status}
            </span>
          </div>

          <div className="p-3 bg-light rounded-3 mb-3 small">
            {isIncoming ? (
              <div>
                <span className="text-muted d-block">Requested by:</span>
                <strong>{requesterName}</strong> ({requesterDept}, {requesterSem} Semester)
              </div>
            ) : (
              <div>
                <span className="text-muted d-block">Book Owner:</span>
                <strong>{ownerName}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2 mt-2">
          {isIncoming && status === 'Pending' && (
            <>
              <button
                onClick={onAccept}
                className="btn btn-sm btn-success fw-semibold w-50"
              >
                <i className="bi bi-check-lg me-1"></i> Accept
              </button>
              <button
                onClick={onReject}
                className="btn btn-sm btn-outline-danger fw-semibold w-50"
              >
                <i className="bi bi-x-lg me-1"></i> Reject
              </button>
            </>
          )}

          {!isIncoming && (
            <button
              onClick={onDelete}
              className="btn btn-sm btn-outline-danger fw-semibold ms-auto"
            >
              <i className="bi bi-trash me-1"></i> Cancel Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestCard;