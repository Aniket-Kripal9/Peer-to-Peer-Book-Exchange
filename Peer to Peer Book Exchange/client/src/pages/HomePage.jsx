import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks } from '../api';
import BookCard from '../components/BookCard';

function HomePage() {
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchRecent() {
      try {
        const data = await getBooks();
        if (!cancelled) {
          // Safety check: verify data is an array before calling .slice()
          if (Array.isArray(data)) {
            setRecentBooks(data.slice(0, 6));
          } else if (data && Array.isArray(data.books)) {
            setRecentBooks(data.books.slice(0, 6));
          } else {
            setRecentBooks([]);
          }
        }
      } catch (err) {
        console.error('Error fetching recent books:', err);
        if (!cancelled) {
          setRecentBooks([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchRecent();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center text-md-start">
        <div className="container py-5">
          <div className="row align-items-center py-4">
            <div className="col-md-7 mb-4 mb-md-0">
              <span className="badge bg-warning text-dark mb-2 px-3 py-2 rounded-pill fw-semibold">
                University Peer-to-Peer Platform
              </span>
              <h1 className="display-4 fw-bold text-white mb-3">
                Exchange Books with Fellow Students Easily
              </h1>
              <p className="lead text-white-50 mb-4">
                Save money, clear your shelf, and help classmate peer-to-peer! Share engineering, literature, science, and course textbooks within your campus.
              </p>
              <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                <Link to="/books" className="btn btn-warning btn-lg fw-semibold px-4">
                  Browse Available Books
                </Link>
                <Link to="/add-book" className="btn btn-outline-light btn-lg fw-semibold px-4">
                  List Your Book
                </Link>
              </div>
            </div>
            <div className="col-md-5 text-center">
              <img
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80"
                alt="Bookshelf"
                className="img-fluid rounded-4 shadow-lg border border-3 border-light-subtle"
                style={{ maxHeight: '360px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="p-3">
                <div className="feature-icon bg-primary bg-opacity-10 text-primary rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                  <i className="bi bi-search fs-2"></i>
                </div>
                <h5 className="fw-bold">Search & Find</h5>
                <p className="text-muted small">
                  Filter by category, title, or author to quickly locate course books for your current semester.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3">
                <div className="feature-icon bg-success bg-opacity-10 text-success rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                  <i className="bi bi-arrow-left-right fs-2"></i>
                </div>
                <h5 className="fw-bold">Request Exchange</h5>
                <p className="text-muted small">
                  Send exchange requests to book owners with a single click. Track status in your Dashboard.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3">
                <div className="feature-icon bg-warning bg-opacity-10 text-warning rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                  <i className="bi bi-people-fill fs-2"></i>
                </div>
                <h5 className="fw-bold">Campus Community</h5>
                <p className="text-muted small">
                  Connect with students in your department and semester to share academic resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Added Books */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
                Recently Added Books
              </h2>
              <p className="text-muted small mb-0">Latest additions from fellow students</p>
            </div>
            <Link to="/books" className="btn btn-outline-primary fw-semibold">
              View All Books <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : recentBooks.length > 0 ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-3">
              {recentBooks.map((book) => (
                <div className="col" key={book._id}>
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info text-center py-4">
              No books listed yet. Be the first to <Link to="/add-book">add a book</Link>!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;