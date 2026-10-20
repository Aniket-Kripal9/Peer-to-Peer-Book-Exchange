import { useState } from "react";
import { Link } from "react-router-dom";
import { createBook, CURRENT_USER } from "../api";

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

const initialFormData = {
  title: "",
  author: "",
  edition: "",
  category: "",
  condition: "",
  description: "",
  image: "",
};

function AddBookPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [createdTitle, setCreatedTitle] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      await createBook({
        ...formData,
        ownerName: CURRENT_USER.name,
        ownerDepartment: CURRENT_USER.department,
        ownerSemester: CURRENT_USER.semester,
        available: true,
      });
      setCreatedTitle(formData.title);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setApiError(
        err.response?.data?.message ||
          "Failed to list book. Is the backend running?",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    setFormData(initialFormData);
    setErrors({});
    setApiError("");
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 text-center">
            <div className="card card-custom p-5">
              <div className="success-icon mb-3">✅</div>
              <h3 className="fw-bold mb-2">Book Listed Successfully!</h3>
              <p className="text-muted mb-4">
                &quot;<strong>{createdTitle}</strong>&quot; has been added to
                the exchange.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button
                  className="btn btn-primary-custom"
                  onClick={handleAddAnother}
                >
                  ➕ Add Another Book
                </button>
                <Link to="/books" className="btn btn-outline-secondary">
                  📚 Browse Books
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
          <h2 className="section-title">List a Book for Exchange</h2>
          <p className="text-muted mb-4">
            Fill in the details below. Listing as{" "}
            <strong>{CURRENT_USER.name}</strong>.
          </p>

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
                  placeholder="e.g., Let Us C"
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
                  placeholder="e.g., Yashavant Kanetkar"
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
                  placeholder="e.g., 19th Edition (optional)"
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
                  placeholder="Condition, markings, missing pages, etc."
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="form-label fw-semibold">
                  Image URL
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="image"
                  name="image"
                  placeholder="https://example.com/cover.jpg (optional)"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary-custom btn-lg w-100"
                disabled={submitting}
              >
                {submitting ? "Listing..." : "📚 List My Book"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddBookPage;
