import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createBook, getCurrentUser } from '../api';

function AddBookPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Protect route: Redirect to /login if visitor is not signed in
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
    } else {
      setCurrentUser(user);
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    edition: '',
    category: 'Computer Science',
    condition: 'Good',
    description: '',
    image: '',
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createBook(formData);
      navigate('/books');
    } catch (err) {
      console.error('Error creating book:', err);
      setError(err.response?.data?.message || 'Failed to list book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-center mb-4">
                <Link
                  to="/books"
                  className="btn btn-outline-secondary btn-sm me-3"
                  title="Back to Books"
                >
                  <i className="bi bi-arrow-left"></i>
                </Link>
                <div>
                  <h3 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
                    List a Book for Exchange
                  </h3>
                  <p className="text-muted small mb-0">
                    Share your textbook or academic book with campus peers
                  </p>
                </div>
              </div>

              {error && <div className="alert alert-danger py-2 fs-6 mb-4">{error}</div>}

              {/* Informative Owner Tag */}
              <div className="alert alert-info py-2 small mb-4">
                Listing as: <strong>{currentUser?.name || 'Student'}</strong> (
                {currentUser?.department || 'CSE'}, {currentUser?.semester || '6th'} Semester)
              </div>

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
                    Leave blank to use an auto-generated cover image.
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

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary fw-semibold px-4 py-2 flex-grow-1"
                  >
                    {loading ? 'Listing Book...' : 'List Book'}
                  </button>
                  <Link to="/books" className="btn btn-outline-secondary px-4 py-2">
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

export default AddBookPage;