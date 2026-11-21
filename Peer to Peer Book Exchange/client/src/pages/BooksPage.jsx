import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks } from '../api';

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Available', 'Exchanged'

  const fetchBooksList = async (search = '', category = 'All') => {
    setLoading(true);
    try {
      const data = await getBooks({
        search: search,
        category: category !== 'All' ? category : '',
      });
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error in BooksPage:', err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooksList(searchTerm, selectedCategory);
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooksList(searchTerm, selectedCategory);
  };

  // Filter books locally by status
  const filteredBooks = books.filter((book) => {
    if (statusFilter === 'Available') {
      return !book.status || book.status === 'Available';
    }
    if (statusFilter === 'Exchanged') {
      return book.status === 'Exchanged';
    }
    return true; // 'All'
  });

  const allCount = books.length;
  const availableCount = books.filter((b) => !b.status || b.status === 'Available').length;
  const exchangedCount = books.filter((b) => b.status === 'Exchanged').length;

  return (
    <div className="container py-4" style={{ minHeight: '85vh', maxWidth: '1100px' }}>
      {/* Title Header matching screenshot */}
      <h2 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>Browse Books</h2>
      <p className="text-muted small mb-4">
        Find textbooks, references, and literature shared by university peers.
      </p>

      {/* Filter and Search Box matching screenshot */}
      <div className="card shadow-sm border p-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center mb-3">
          <div className="col-12 col-md-7">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, author, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary fw-semibold px-4">
              Search
            </button>
          </div>
          <div className="col-12 col-md d-flex align-items-center justify-content-md-end gap-2 mt-2 mt-md-0">
            <label htmlFor="catSelect" className="small text-muted mb-0 fw-semibold">
              Category:
            </label>
            <select
              id="catSelect"
              className="form-select form-select-sm w-auto"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Literature">Literature</option>
              <option value="Business">Business</option>
              <option value="History">History</option>
              <option value="Competitive Exams">Competitive Exams</option>
            </select>
          </div>
        </form>

        {/* Status Pill Filters matching screenshot */}
        <div className="d-flex align-items-center gap-2 flex-wrap pt-2 border-top">
          <span className="small text-muted fw-semibold me-1">Status:</span>

          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 ${
              statusFilter === 'All' ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => setStatusFilter('All')}
          >
            All Books ({allCount})
          </button>

          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 ${
              statusFilter === 'Available' ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => setStatusFilter('Available')}
          >
            Available Only ({availableCount})
          </button>

          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 ${
              statusFilter === 'Exchanged' ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => setStatusFilter('Exchanged')}
          >
            Exchanged ({exchangedCount})
          </button>
        </div>
      </div>

      {/* Counter */}
      <p className="small text-muted mb-3">
        Showing <strong>{filteredBooks.length}</strong> books
      </p>

      {/* Loading state */}
      {loading ? (
        <div className="card shadow-sm border text-center p-5">
          <div className="spinner-border text-primary mx-auto mb-2" role="status"></div>
          <p className="text-muted small mb-0">Loading available books...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        /* Empty State matching screenshot */
        <div className="card shadow-sm border text-center py-5 px-3">
          <h5 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>No books found</h5>
          <p className="text-muted small mb-0">
            Try adjusting your search keywords, category, or availability filter.
          </p>
        </div>
      ) : (
        /* Books Grid */
        <div className="row g-4">
          {filteredBooks.map((book) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={book._id}>
              <div className="card h-100 shadow-sm border">
                <img
                  src={book.image || 'https://via.placeholder.com/300x400?text=No+Cover'}
                  alt={book.title}
                  className="card-img-top"
                  style={{ height: '220px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover';
                  }}
                />
                <div className="card-body d-flex flex-column p-3">
                  <span className="badge bg-secondary mb-2 align-self-start" style={{ fontSize: '0.75rem' }}>
                    {book.category}
                  </span>
                  <h6 className="card-title fw-bold text-truncate mb-1" style={{ color: '#2c3e50' }}>
                    {book.title}
                  </h6>
                  <p className="card-text text-muted small mb-2">by {book.author}</p>
                  <p className="card-text text-secondary small flex-grow-1 text-truncate mb-3">
                    {book.description || 'No description provided.'}
                  </p>
                  <Link
                    to={`/books/${book._id}`}
                    className="btn btn-sm btn-outline-primary w-100 fw-semibold mt-auto"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BooksPage;