import { useState, useEffect } from 'react';
import { getBooks } from '../api';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all' | 'available' | 'exchanged'
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

  const safeBooks = Array.isArray(books) ? books : [];

  // Filter books by availability (All, Available Only, or Exchanged)
  const filteredBooks = safeBooks.filter((book) => {
    if (availabilityFilter === 'available') {
      return book.available === true;
    }
    if (availabilityFilter === 'exchanged') {
      return book.available === false;
    }
    return true; // 'all'
  });

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: 'var(--primary-color)' }}>
          Browse Books
        </h2>
        <p className="text-muted small">
          Find textbooks, references, and literature shared by university peers.
        </p>
      </div>

      {/* Filter Card */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-md-7">
              <SearchBar
                searchTerm={search}
                onSearchChange={setSearch}
                placeholder="Search by title, author, or keyword..."
              />
            </div>

            {/* Category Dropdown */}
            <div className="col-md-5">
              <div className="d-flex align-items-center">
                <label
                  className="form-label mb-0 me-2 text-nowrap fw-semibold small"
                  htmlFor="category-select"
                >
                  Category:
                </label>
                <select
                  id="category-select"
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

          {/* Availability Filter Buttons */}
          <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top flex-wrap">
            <span className="text-muted small fw-semibold me-1">Status:</span>
            <button
              type="button"
              className={`btn btn-sm ${
                availabilityFilter === 'all'
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              } fw-semibold px-3 rounded-pill`}
              onClick={() => setAvailabilityFilter('all')}
            >
              All Books ({safeBooks.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${
                availabilityFilter === 'available'
                  ? 'btn-success'
                  : 'btn-outline-secondary'
              } fw-semibold px-3 rounded-pill`}
              onClick={() => setAvailabilityFilter('available')}
            >
              <i className="bi bi-check-circle me-1"></i> Available Only (
              {safeBooks.filter((b) => b.available).length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${
                availabilityFilter === 'exchanged'
                  ? 'btn-danger'
                  : 'btn-outline-secondary'
              } fw-semibold px-3 rounded-pill`}
              onClick={() => setAvailabilityFilter('exchanged')}
            >
              <i className="bi bi-arrow-left-right me-1"></i> Exchanged (
              {safeBooks.filter((b) => !b.available).length})
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* Results Summary */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted small">
          Showing <strong>{filteredBooks.length}</strong> {filteredBooks.length === 1 ? 'book' : 'books'}
        </span>
        {(search || selectedCategory || availabilityFilter !== 'all') && (
          <button
            className="btn btn-sm btn-link text-decoration-none text-danger p-0"
            onClick={() => {
              setSearch('');
              setSelectedCategory('');
              setAvailabilityFilter('all');
            }}
          >
            Clear All Filters
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
      ) : filteredBooks.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredBooks.map((book) => (
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
            Try adjusting your search keywords, category, or availability filter.
          </p>
        </div>
      )}
    </div>
  );
}

export default BooksPage;