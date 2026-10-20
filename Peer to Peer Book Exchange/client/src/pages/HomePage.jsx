import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import { getBooks } from "../api";

function HomePage() {
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchRecent = async () => {
      try {
        const { data } = await getBooks();
        if (!cancelled) setRecentBooks(data.slice(0, 4));
      } catch (err) {
        console.error(err);
        if (!cancelled)
          setError("Could not load books. Is the backend running?");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRecent();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section text-white text-center">
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">Swap Books, Save Money 📖</h1>
          <p className="lead mb-4 mx-auto hero-subtitle">
            A peer-to-peer book exchange platform built for university students.
            List the books you no longer need and find the ones you do — for
            free!
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/books" className="btn btn-light btn-lg fw-semibold px-4">
              Browse Books
            </Link>
            <Link
              to="/add-book"
              className="btn btn-outline-light btn-lg fw-semibold px-4"
            >
              List a Book
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title text-center">How It Works</h2>
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4">
                <div className="step-icon mb-3">📋</div>
                <h5 className="fw-bold">1. List Your Book</h5>
                <p className="text-muted">
                  Add the books you no longer need with a few details like
                  title, author, and condition.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4">
                <div className="step-icon mb-3">🔍</div>
                <h5 className="fw-bold">2. Browse & Request</h5>
                <p className="text-muted">
                  Search for books you need and send an exchange request to the
                  owner.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4">
                <div className="step-icon mb-3">🤝</div>
                <h5 className="fw-bold">3. Exchange!</h5>
                <p className="text-muted">
                  Once the request is accepted, meet up on campus and swap your
                  books.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RECENT BOOKS ===== */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title mb-0">Recently Listed Books</h2>
            <Link to="/books" className="text-decoration-none fw-semibold">
              View All →
            </Link>
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="text-muted mt-2">Loading books...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-warning text-center">{error}</div>
          )}

          {!loading && !error && recentBooks.length === 0 && (
            <p className="text-center text-muted">No books listed yet.</p>
          )}

          {!loading && !error && recentBooks.length > 0 && (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {recentBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
