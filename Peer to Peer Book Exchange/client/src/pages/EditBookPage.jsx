import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const categories = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Engineering",
  "Literature",
  "Humanities",
  "Business",
  "Other",
];

const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

// Dummy data — same IDs used across the app (will be replaced by API later)
const allBooks = [
  {
    _id: "1",
    title: "Data Structures and Algorithms",
    author: "Cormen, Leiserson",
    edition: "3rd Edition",
    category: "Computer Science",
    condition: "Good",
    description:
      "Comprehensive introduction to algorithms. Covers sorting, graph algorithms, dynamic programming, and more. Some highlighting in chapters 1-5, otherwise in great shape.",
    image: "https://via.placeholder.com/400x550?text=DSA",
    available: true,
  },
  {
    _id: "2",
    title: "Engineering Mathematics",
    author: "B.S. Grewal",
    edition: "44th Edition",
    category: "Mathematics",
    condition: "Like New",
    description:
      "Barely used — bought it at the start of the semester but switched to a different course. No markings or damage.",
    image: "https://via.placeholder.com/400x550?text=Math",
    available: true,
  },
  {
    _id: "3",
    title: "Organic Chemistry",
    author: "Morrison & Boyd",
    edition: "7th Edition",
    category: "Chemistry",
    condition: "Fair",
    description:
      "Classic organic chemistry textbook. Has some notes in the margins and a few dog-eared pages, but all content is intact and readable.",
    image: "https://via.placeholder.com/400x550?text=Chemistry",
    available: true,
  },
  {
    _id: "4",
    title: "Introduction to Psychology",
    author: "Robert Feldman",
    edition: "13th Edition",
    category: "Humanities",
    condition: "New",
    description:
      "Brand new, still in shrink wrap. Already exchanged with another student.",
    image: "https://via.placeholder.com/400x550?text=Psychology",
    available: false,
  },
  {
    _id: "5",
    title: "Operating System Concepts",
    author: "Silberschatz, Galvin",
    edition: "10th Edition",
    category: "Computer Science",
    condition: "Good",
    description:
      'The famous "Dinosaur Book". Used for one semester. Clean copy with no writing inside.',
    image: "https://via.placeholder.com/400x550?text=OS",
    available: true,
  },
  {
    _id: "6",
    title: "University Physics",
    author: "Young & Freedman",
    edition: "15th Edition",
    category: "Physics",
    condition: "Like New",
    description:
      "Excellent condition. Includes access code (unused). Perfect for first-year physics courses.",
    image: "https://via.placeholder.com/400x550?text=Physics",
    available: true,
  },
  {
    _id: "7",
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    edition: "9th Edition",
    category: "Business",
    condition: "Good",
    description:
      "Standard intro economics textbook. Some pencil marks that can be erased. Overall very good condition.",
    image: "https://via.placeholder.com/400x550?text=Economics",
    available: true,
  },
  {
    _id: "8",
    title: "Molecular Biology of the Cell",
    author: "Bruce Alberts",
    edition: "6th Edition",
    category: "Biology",
    condition: "Fair",
    description:
      "Heavy but comprehensive. Cover has some wear, pages are clean. Great reference for cell biology.",
    image: "https://via.placeholder.com/400x550?text=Biology",
    available: true,
  },
];

function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    edition: "",
    category: "",
    condition: "",
    description: "",
    image: "",
    available: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load book by ID (simulated)
  useEffect(() => {
    const timer = setTimeout(() => {
      const found = allBooks.find((b) => b._id === id);
      if (!found) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setFormData({
        title: found.title || "",
        author: found.author || "",
        edition: found.edition || "",
        category: found.category || "",
        condition: found.condition || "",
        description: found.description || "",
        image: found.image || "",
        available: found.available !== false,
      });
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Book title is required.";
    }
    if (!formData.author.trim()) {
      newErrors.author = "Author name is required.";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category.";
    }
    if (!formData.condition) {
      newErrors.condition = "Please select a condition.";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Please add a short description.";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Simulate API update
    console.log("Book updated:", { _id: id, ...formData });
    setSaved(true);
  };

  // --- Loading ---
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

  // --- Not Found ---
  if (notFound) {
    return (
      <div className="container text-center py-5">
        <div className="empty-state-icon mb-3">😕</div>
        <h4 className="fw-bold text-muted">Book Not Found</h4>
        <p className="text-muted">
          The book you're trying to edit doesn't exist or has been removed.
        </p>
        <Link to="/dashboard" className="btn btn-primary-custom mt-2">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  // --- Success ---
  if (saved) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 text-center">
            <div className="card card-custom p-5">
              <div className="success-icon mb-3">✅</div>
              <h3 className="fw-bold mb-2">Book Updated Successfully!</h3>
              <p className="text-muted mb-4">
                "<strong>{formData.title}</strong>" has been updated.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to={`/books/${id}`} className="btn btn-primary-custom">
                  📖 View Book
                </Link>
                <Link to="/dashboard" className="btn btn-outline-secondary">
                  📊 Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Edit Form ---
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <button
            type="button"
            className="btn btn-link text-decoration-none p-0 mb-3 back-link"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <h2 className="section-title">Edit Book Listing</h2>
          <p className="text-muted mb-4">
            Update the details of your book below, then save your changes.
          </p>

          <div className="card card-custom p-4">
            <form onSubmit={handleSubmit} noValidate>
              {/* Title */}
              <div className="mb-3">
                <label htmlFor="title" className="form-label fw-semibold">
                  Book Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>

              {/* Author */}
              <div className="mb-3">
                <label htmlFor="author" className="form-label fw-semibold">
                  Author <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.author ? "is-invalid" : ""}`}
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                />
                {errors.author && (
                  <div className="invalid-feedback">{errors.author}</div>
                )}
              </div>

              {/* Edition */}
              <div className="mb-3">
                <label htmlFor="edition" className="form-label fw-semibold">
                  Edition
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="edition"
                  name="edition"
                  placeholder="e.g., 3rd Edition (optional)"
                  value={formData.edition}
                  onChange={handleChange}
                />
              </div>

              {/* Category & Condition */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="category" className="form-label fw-semibold">
                    Category <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${errors.category ? "is-invalid" : ""}`}
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <div className="invalid-feedback">{errors.category}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="condition" className="form-label fw-semibold">
                    Condition <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${errors.condition ? "is-invalid" : ""}`}
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                  >
                    <option value="">Select condition</option>
                    {conditions.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                  {errors.condition && (
                    <div className="invalid-feedback">{errors.condition}</div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label htmlFor="description" className="form-label fw-semibold">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
                {errors.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
              </div>

              {/* Image URL */}
              <div className="mb-3">
                <label htmlFor="image" className="form-label fw-semibold">
                  Image URL
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="image"
                  name="image"
                  placeholder="https://example.com/book-cover.jpg (optional)"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>

              {/* Availability */}
              <div className="mb-4 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="available"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label fw-semibold"
                  htmlFor="available"
                >
                  Available for exchange
                </label>
                <div className="form-text">
                  Uncheck if this book has already been exchanged.
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex gap-3 flex-wrap">
                <button
                  type="submit"
                  className="btn btn-primary-custom btn-lg flex-grow-1"
                >
                  💾 Save Changes
                </button>
                <Link
                  to="/dashboard"
                  className="btn btn-outline-secondary btn-lg"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBookPage;
