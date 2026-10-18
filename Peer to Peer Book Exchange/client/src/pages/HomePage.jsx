import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";

// Dummy data — will be replaced with API calls later
const recentBooks = [
  {
    _id: "1",
    title: "Data Structures and Algorithms",
    author: "Cormen, Leiserson",
    category: "Computer Science",
    condition: "Good",
    available: true,
    image: "https://via.placeholder.com/300x400?text=DSA",
  },
  {
    _id: "2",
    title: "Engineering Mathematics",
    author: "B.S. Grewal",
    category: "Mathematics",
    condition: "Like New",
    available: true,
    image: "https://via.placeholder.com/300x400?text=Math",
  },
  {
    _id: "3",
    title: "Organic Chemistry",
    author: "Morrison & Boyd",
    category: "Chemistry",
    condition: "Fair",
    available: true,
    image: "https://via.placeholder.com/300x400?text=Chemistry",
  },
  {
    _id: "4",
    title: "Introduction to Psychology",
    author: "Robert Feldman",
    category: "Humanities",
    condition: "New",
    available: false,
    image: "https://via.placeholder.com/300x400?text=Psychology",
  },
];

function HomePage() {
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
          <div className="d-flex justify-content-center gap-3">
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

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title text-center">How It Works</h2>
          <div className="row g-4 text-center">
            {/* Step 1 */}
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

            {/* Step 2 */}
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

            {/* Step 3 */}
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

      {/* ===== RECENT BOOKS SECTION ===== */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title mb-0">Recently Listed Books</h2>
            <Link to="/books" className="text-decoration-none fw-semibold">
              View All →
            </Link>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {recentBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
