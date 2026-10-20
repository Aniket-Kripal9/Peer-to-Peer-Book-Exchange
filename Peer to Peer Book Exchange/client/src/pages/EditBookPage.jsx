import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBookById, updateBook } from "../api";

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
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchBook = async () => {
      try {
        const { data } = await getBookById(id);
        if (!cancelled) {
          setFormData({
            title: data.title || "",
            author: data.author || "",
            edition: data.edition || "",
            category: data.category || "",
            condition: data.condition || "",
            description: data.description || "",
            image: data.image || "",
            available: data.available !== false,
          });
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBook();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Book title is required.";
    if (!formData.author.trim()) newErrors.author = "Author name is required.";
    if (!formData.category) newErrors.category = "Please select a category.";
    if (!formData.condition) newErrors.condition = "Please select a condition.";
    if (!formData.description.trim()) {
      newErrors.description = "Please add a short description.";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      setApiError("");
      await updateBook(id, formData);
      setSaved(true);
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Failed to update book. Try again.",
      );
    } finally {
      setSubmitting(false);
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

  if (notFound) {
    return (
      <div className="container text-center py-5">
        <div className="empty-state-icon mb-3">😕</div>
        <h4 className="fw-bold text-muted">Book Not Found</h4>
        <Link to="/dashboard" className="btn btn-primary-custom mt-2">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 text-center">
            <div className="card card-custom p-5">
              <div className="success-icon mb-3">✅</div>
              <h3 className="fw-bold mb-2">Book Updated Successfully!</h3>
              <p className="text-muted mb-4">
                &quot;<strong>{formData.title}</strong>&quot; has been updated.
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
          <p className="text-muted mb-4">Update details, then save.</p>

          <div className="card card-custom p-4">
            {apiError && <div className="alert alert-danger">{apiError}</div>}

            <form onSubmit={handleSubmit} noValidate>
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

              <div className="mb-3">
                <label htmlFor="edition" className="form-label fw-semibold">
                  Edition
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="edition"
                  name="edition"
                  value={formData.edition}
                  onChange={handleChange}
                />
              </div>

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
                    className={`form-select ${
                      errors.condition ? "is-invalid" : ""
                    }`}
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

              <div className="mb-3">
                <label htmlFor="description" className="form-label fw-semibold">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${
                    errors.description ? "is-invalid" : ""
                  }`}
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="image" className="form-label fw-semibold">
                  Image URL
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>

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
              </div>

              <div className="d-flex gap-3 flex-wrap">
                <button
                  type="submit"
                  className="btn btn-primary-custom btn-lg flex-grow-1"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "💾 Save Changes"}
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
