import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBookById, updateBook } from '../api';

function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    edition: '',
    category: 'Computer Science',
    condition: 'Good',
    description: '',
    image: '',
    available: true,
  });

  const categories = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Literature',
    'Humanities',
    'Business',
    'Other',
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  useEffect(() => {
    let cancelled = false;

    async function fetchBook() {
      setLoading(true);
      try {
        const data = await getBookById(id);

        if (!cancelled) {
          // Normalize response: handle both direct object and nested { book: {...} }
          const bookData =
            data && (data._id || data.title)
              ? data
              : data && data.book
              ? data.book
              : null;

          if (bookData) {
            setFormData({
              title: bookData.title || '',
              author: bookData.author || '',
              edition: bookData.edition || '',
              category: bookData.category || 'Computer Science',
              condition: bookData.condition || 'Good',
              description: bookData.description || '',
              image: bookData.image || '',
              available: bookData.available !== undefined ? bookData.available : true,
            });
            setNotFound(false);
            setError('');
          } else {
            setNotFound(true);
          }
        }
      } catch (err) {
        console.error('Error fetching book for edit:', err);
        if (!cancelled) {
          setError(err.response?.data?.message || 'Failed to fetch book details.');
          setNotFound(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      fetchBook();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await updateBook(id, formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error updating book:', err);
      setError(err.response?.data?.message || 'Failed to update book listing.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading book details...</span>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5 bg-white rounded-3 shadow-sm p-4 col-md-6 mx-auto">
          <i className="bi bi-exclamation-triangle fs-1 text-warning"></i>
          <h3 className="fw-bold mt-3" style={{ color: 'var(--primary-color)' }}>
            Book Not Found
          </h3>
          <p className="text-muted small mb-4">
            {error || 'The book listing you are trying to edit does not exist.'}
          </p>
          <Link to="/dashboard" className="btn btn-primary fw-semibold px-4">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-center mb-4">
                <Link
                  to="/dashboard"
                  className="btn btn-outline-secondary btn-sm me-3"
                  title="Back to Dashboard"
                >
                  <i className="bi bi-arrow-left"></i>
                </Link>
                <div>
                  <h3 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
                    Edit Book Listing
                  </h3>
                  <p className="text-muted small mb-0">
                    Update details or availability for your book
                  </p>
                </div>
              </div>

              {error && <div className="alert alert-danger py-2 fs-6 mb-4">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Book Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="e.g. Operating System Concepts"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Author *</label>
                    <input
                      type="text"
                      name="author"
                      className="form-control"
                      placeholder="e.g. Abraham Silberschatz"
                      value={formData.author}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Edition</label>
                    <input
                      type="text"
                      name="edition"
                      className="form-control"
                      placeholder="e.g. 10th Edition"
                      value={formData.edition}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Category *</label>
                    <select
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Condition *</label>
                    <select
                      name="condition"
                      className="form-select"
                      value={formData.condition}
                      onChange={handleChange}
                      required
                    >
                      {conditions.map((cond) => (
                        <option key={cond} value={cond}>
                          {cond}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Cover Image URL</label>
                  <input
                    type="url"
                    name="image"
                    className="form-control"
                    placeholder="https://example.com/book-cover.jpg"
                    value={formData.image}
                    onChange={handleChange}
                  />
                  <div className="form-text small">
                    Leave blank to keep auto-generated fallback cover.
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    className="form-control"
                    placeholder="Describe the condition, notes, or highlights in the book..."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="form-check form-switch mb-4 p-3 bg-light rounded-3">
                  <input
                    className="form-check-input ms-0 me-2"
                    type="checkbox"
                    id="availableSwitch"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="availableSwitch">
                    Available for Swap
                  </label>
                  <div className="text-muted small">
                    Uncheck if this book has been exchanged or is temporarily unavailable.
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary fw-semibold px-4 py-2 flex-grow-1"
                  >
                    {saving ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                  <Link to="/dashboard" className="btn btn-outline-secondary px-4 py-2">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBookPage;