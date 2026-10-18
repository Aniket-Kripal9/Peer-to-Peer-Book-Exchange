import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// Dummy data — same as BooksPage, will be replaced with API call later
const allBooks = [
  {
    _id: "1",
    title: "Data Structures and Algorithms",
    author: "Cormen, Leiserson",
    edition: "3rd Edition",
    category: "Computer Science",
    condition: "Good",
    available: true,
    description:
      "Comprehensive introduction to algorithms. Covers sorting, graph algorithms, dynamic programming, and more. Some highlighting in chapters 1-5, otherwise in great shape.",
    image: "https://via.placeholder.com/400x550?text=DSA",
    owner: { name: "Ali Ahmed", department: "CS", semester: "6th" },
    listedDate: "2025-01-10",
  },
  {
    _id: "2",
    title: "Engineering Mathematics",
    author: "B.S. Grewal",
    edition: "44th Edition",
    category: "Mathematics",
    condition: "Like New",
    available: true,
    description:
      "Barely used — bought it at the start of the semester but switched to a different course. No markings or damage.",
    image: "https://via.placeholder.com/400x550?text=Math",
    owner: { name: "Sara Khan", department: "EE", semester: "4th" },
    listedDate: "2025-01-15",
  },
  {
    _id: "3",
    title: "Organic Chemistry",
    author: "Morrison & Boyd",
    edition: "7th Edition",
    category: "Chemistry",
    condition: "Fair",
    available: true,
    description:
      "Classic organic chemistry textbook. Has some notes in the margins and a few dog-eared pages, but all content is intact and readable.",
    image: "https://via.placeholder.com/400x550?text=Chemistry",
    owner: { name: "Usman Tariq", department: "Chem", semester: "5th" },
    listedDate: "2025-02-01",
  },
  {
    _id: "4",
    title: "Introduction to Psychology",
    author: "Robert Feldman",
    edition: "13th Edition",
    category: "Humanities",
    condition: "New",
    available: false,
    description:
      "Brand new, still in shrink wrap. Already exchanged with another student.",
    image: "https://via.placeholder.com/400x550?text=Psychology",
    owner: { name: "Fatima Noor", department: "Psych", semester: "3rd" },
    listedDate: "2024-12-20",
  },
  {
    _id: "5",
    title: "Operating System Concepts",
    author: "Silberschatz, Galvin",
    edition: "10th Edition",
    category: "Computer Science",
    condition: "Good",
    available: true,
    description:
      'The famous "Dinosaur Book". Used for one semester. Clean copy with no writing inside.',
    image: "https://via.placeholder.com/400x550?text=OS",
    owner: { name: "Hassan Raza", department: "CS", semester: "7th" },
    listedDate: "2025-01-22",
  },
  {
    _id: "6",
    title: "University Physics",
    author: "Young & Freedman",
    edition: "15th Edition",
    category: "Physics",
    condition: "Like New",
    available: true,
    description:
      "Excellent condition. Includes access code (unused). Perfect for first-year physics courses.",
    image: "https://via.placeholder.com/400x550?text=Physics",
    owner: { name: "Ayesha Malik", department: "Phys", semester: "2nd" },
    listedDate: "2025-02-05",
  },
  {
    _id: "7",
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    edition: "9th Edition",
    category: "Business",
    condition: "Good",
    available: true,
    description:
      "Standard intro economics textbook. Some pencil marks that can be erased. Overall very good condition.",
    image: "https://via.placeholder.com/400x550?text=Economics",
    owner: { name: "Bilal Sheikh", department: "BBA", semester: "4th" },
    listedDate: "2025-01-28",
  },
  {
    _id: "8",
    title: "Molecular Biology of the Cell",
    author: "Bruce Alberts",
    edition: "6th Edition",
    category: "Biology",
    condition: "Fair",
    available: true,
    description:
      "Heavy but comprehensive. Cover has some wear, pages are clean. Great reference for cell biology.",
    image: "https://via.placeholder.com/400x550?text=Biology",
    owner: { name: "Zainab Ali", department: "Bio", semester: "6th" },
    listedDate: "2025-02-10",
  },
];

// Condition badge color mapping
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

  // Simulate fetching a single book by ID
  useEffect(() => {
    const timer = setTimeout(() => {
      const found = allBooks.find((b) => b._id === id);
      setBook(found || null);
      setLoading(false);
    }, 300); // small delay to simulate API call

    return () => clearTimeout(timer);
  }, [id]);

  const handleRequest = () => {
    alert(
      "🔒 Authentication required!\n\nLogin feature will be added later. Once logged in, you will be able to send an exchange request to the book owner.",
    );
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading book details...</p>
      </div>
    );
  }

  // --- Not Found State ---
  if (!book) {
    return (
      <div className="container text-center py-5">
        <div className="empty-state-icon mb-3">😕</div>
        <h4 className="fw-bold text-muted">Book Not Found</h4>
        <p className="text-muted">
          The book you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/books" className="btn btn-primary-custom mt-2">
          ← Back to Browse
        </Link>
      </div>
    );
  }

  // --- Book Detail View ---
  return (
    <div className="container py-4">
      {/* Back Button */}
      <button
        className="btn btn-link text-decoration-none p-0 mb-3 back-link"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="card card-custom p-0 overflow-hidden">
        <div className="row g-0">
          {/* Left: Book Image */}
          <div className="col-md-4">
            <div className="detail-image-wrapper">
              <img
                src={book.image}
                className="img-fluid h-100 w-100"
                alt={book.title}
                style={{ objectFit: "cover" }}
              />
              {/* Availability overlay badge */}
              <span
                className={`badge position-absolute top-0 start-0 m-3 fs-6 ${
                  book.available ? "bg-success" : "bg-secondary"
                }`}
              >
                {book.available ? "✅ Available" : "❌ Exchanged"}
              </span>
            </div>
          </div>

          {/* Right: Book Details */}
          <div className="col-md-8">
            <div className="card-body p-4">
              {/* Title & Author */}
              <h2 className="fw-bold mb-1">{book.title}</h2>
              <p className="text-muted fs-5 mb-3">by {book.author}</p>

              {/* Info Badges */}
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
                <span className="badge bg-light text-dark border fs-6 px-3 py-2">
                  📘 {book.edition}
                </span>
              </div>

              {/* Description */}
              <h6 className="fw-bold mb-2">Description</h6>
              <p className="text-muted mb-4">{book.description}</p>

              <hr />

              {/* Owner Info */}
              <h6 className="fw-bold mb-2">Listed By</h6>
              <div className="d-flex align-items-center mb-3">
                <div className="owner-avatar me-3">
                  {book.owner.name.charAt(0)}
                </div>
                <div>
                  <p className="mb-0 fw-semibold">{book.owner.name}</p>
                  <small className="text-muted">
                    {book.owner.department} • {book.owner.semester} Semester
                  </small>
                </div>
              </div>

              <small className="text-muted d-block mb-4">
                Listed on{" "}
                {new Date(book.listedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </small>

              {/* Request Button */}
              {book.available ? (
                <button
                  className="btn btn-primary-custom btn-lg w-100"
                  onClick={handleRequest}
                >
                  🤝 Request Exchange
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
