import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBook, getCurrentUser } from '../api';

function AddBookPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    edition: '',
    category: 'Computer Science',
    condition: 'Good',
    image: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.author.trim()) {
      setError('Book title and author are required.');
      return;
    }

    setLoading(true);

    try {
      await createBook({
        title: formData.title.trim(),
        author: formData.author.trim(),
        edition: formData.edition.trim(),
        category: formData.category,
        condition: formData.condition,
        image: formData.image.trim() || 'https://via.placeholder.com/300x400?text=No+Cover',
        description: formData.description.trim(),
        ownerName: currentUser.name,
        ownerEmail: currentUser.email,
      });

      // ONLY navigate on verified successful creation
      navigate('/dashboard');
    } catch (err) {
      // Display backend error message without falsely redirecting
      setError(err.message || 'Failed to list book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="container py-4" style={{ minHeight: '85vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-9 col-lg-7" style={{ maxWidth: '680px' }}>
          <div className="card shadow-sm border p-4 p-md-5">
            {/* Header matching screenshot */}
            <div className="d-flex align-items-center mb-1">
              <span className="me-2" style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid #6c757d', borderRadius: '4px' }}></span>
              <h4 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>
                List a Book for Exchange
              </h4>
            </div>
            <p className="text-muted small mb-3">
              Share your textbook or academic book with campus peers
            </p>

            {/* Light blue "Listing as:" callout banner */}
            <div
              className="p-2 px-3 rounded mb-4"
              style={{
                backgroundColor: '#d1f2fb',
                color: '#0c5460',
                fontSize: '0.875rem',
              }}
            >
              Listing as: <strong>{currentUser.name}</strong> ({currentUser.department || 'CSE'}, {currentUser.semester || '1st Semester'})
            </div>

            {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Book Title */}
              <div className="mb-3">
                <label htmlFor="title" className="form-label fw-semibold small mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  placeholder="e.g. Operating System Concepts"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Author & Edition Row */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="author" className="form-label fw-semibold small mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="author"
                    name="author"
                    placeholder="e.g. Abraham Silberschatz"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="edition" className="form-label fw-semibold small mb-1">
                    Edition
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edition"
                    name="edition"
                    placeholder="e.g. 10th Edition"
                    value={formData.edition}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Category & Condition Row */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="category" className="form-label fw-semibold small mb-1">
                    Category *
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Literature">Literature</option>
                    <option value="Business">Business</option>
                    <option value="History">History</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="condition" className="form-label fw-semibold small mb-1">
                    Condition *
                  </label>
                  <select
                    className="form-select"
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                  >
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Acceptable">Acceptable</option>
                  </select>
                </div>
              </div>

              {/* Cover Image URL */}
              <div className="mb-3">
                <label htmlFor="image" className="form-label fw-semibold small mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="image"
                  name="image"
                  placeholder="https://example.com/book-cover.jpg"
                  value={formData.image}
                  onChange={handleChange}
                />
                <div className="form-text text-muted" style={{ fontSize: '0.8rem' }}>
                  Leave blank to use an auto-generated cover image.
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description" className="form-label fw-semibold small mb-1">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="4"
                  placeholder="Describe the condition, notes, or highlights in the book..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Buttons matching screenshot: List Book (broad) + Cancel */}
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary fw-semibold flex-grow-1 py-2"
                  disabled={loading}
                >
                  {loading ? 'Listing...' : 'List Book'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 py-2"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddBookPage;