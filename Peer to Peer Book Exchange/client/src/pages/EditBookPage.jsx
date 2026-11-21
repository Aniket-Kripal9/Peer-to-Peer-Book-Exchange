import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBookById, updateBook, getCurrentUser } from '../api';

function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Engineering',
    description: '',
    image: '',
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchBook = async () => {
      try {
        const book = await getBookById(id);
        if (!book) {
          setError('Book not found.');
          return;
        }

        if (book.ownerEmail !== currentUser.email) {
          setError('You are not authorized to edit this book.');
          return;
        }

        setFormData({
          title: book.title || '',
          author: book.author || '',
          category: book.category || 'Engineering',
          description: book.description || '',
          image: book.image || '',
        });
      } catch (err) {
        setError(err.message || 'Failed to load book data.');
      } finally {
        setPageLoading(false);
      }
    };

    fetchBook();
  }, [id, currentUser, navigate]);

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
      setError('Please provide both the book title and author.');
      return;
    }

    setLoading(true);

    try {
      await updateBook(id, {
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category,
        description: formData.description.trim(),
        image: formData.image.trim() || 'https://via.placeholder.com/300x400?text=No+Cover',
      });

      // Only navigate away once the server confirms update
      navigate('/dashboard');
    } catch (err) {
      // Display actual server error message to user
      setError(err.message || 'Failed to update book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  if (pageLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading book details...</p>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ minHeight: '80vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 p-4">
            <h3 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>
              Edit Book Listing
            </h3>
            <p className="text-muted small mb-4">
              Update details for your listed book
            </p>

            {error && <div className="alert alert-danger alert-dismissible">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label fw-semibold">
                  Book Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="author" className="form-label fw-semibold">
                  Author <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="category" className="form-label fw-semibold">
                  Category
                </label>
                <select
                  className="form-select"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Science">Science</option>
                  <option value="Math">Math</option>
                  <option value="Literature">Literature</option>
                  <option value="History">History</option>
                  <option value="Biography">Biography</option>
                  <option value="Competitive Exams">Competitive Exams</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="image" className="form-label fw-semibold">
                  Cover Image URL
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

              <div className="mb-4">
                <label htmlFor="description" className="form-label fw-semibold">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="d-flex gap-2">
                <Link to="/dashboard" className="btn btn-outline-secondary w-50">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary w-50 fw-semibold"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBookPage;