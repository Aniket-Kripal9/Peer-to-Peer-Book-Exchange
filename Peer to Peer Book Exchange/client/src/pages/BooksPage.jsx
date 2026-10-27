import { useState, useEffect } from 'react';
import { getBooks } from '../api';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    'All',
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

  useEffect(() => {
    let cancelled = false;

    async function fetchBooks() {
      setLoading(true);
      try {
        const categoryFilter = selectedCategory === 'All' ? '' : selectedCategory;
        const data = await getBooks(search, categoryFilter);

        if (!cancelled) {
          // Defensive check to ensure data is an array
          if (Array.isArray(data)) {
            setBooks(data);
          } else if (data && Array.isArray(data.books)) {
            setBooks(data.books);
          } else {
            setBooks([]);
          }
          setError('');
        }
      } catch (err) {
        console.error('Error fetching books:', err);
        if (!cancelled) {
          setError('Failed to load books. Please try again.');
          setBooks([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchBooks();

    return () => {
      cancelled = true;
    };
  }, [search, selectedCategory]);

  // Safe reference to books array
  const safeBooks = Array.isArray(books) ? books : [];

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: 'var(--primary-color)' }}>
          Browse Available Books
        </h2>
        <p className="text-muted small">
          Find textbooks, references, and literature shared by university peers.
        </p>
      </div>

      {/* Search and Category Filter Controls */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-7">
              <SearchBar
                searchTerm={search}
                onSearchChange={setSearch}
                placeholder="Search by title, author, or keyword..."
              />
            </div>
            <div className="col-md-5">
              <div className="d-flex align-items-center">
                <label className="form-label mb-0 me-2 text-nowrap fw-semibold small">
                  Category:
                </label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat === 'All' ? '' : cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* Results Summary */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted small">
          Showing <strong>{safeBooks.length}</strong> {safeBooks.length === 1 ? 'book' : 'books'}
        </span>
        {(search || selectedCategory) && (
          <button
            className="btn btn-sm btn-link text-decoration-none text-danger p-0"
            onClick={() => {
              setSearch('');
              setSelectedCategory('');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : safeBooks.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {safeBooks.map((book) => (
            <div className="col" key={book._id}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm p-4">
          <i className="bi bi-book-half fs-1 text-muted"></i>
          <h5 className="fw-bold mt-2">No books found</h5>
          <p className="text-muted small mb-0">
            Try adjusting your search keywords or category filters.
          </p>
        </div>
      )}
    </div>
  );
}

export default BooksPage;