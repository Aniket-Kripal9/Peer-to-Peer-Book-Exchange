import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import SearchBar from "../components/SearchBar";
import { getBooks } from "../api";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Used by the SearchBar (event handler — synchronous setState is fine here)
  const fetchBooks = async (query = "", category = "All") => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (query) params.search = query;
      if (category && category !== "All") params.category = category;

      const { data } = await getBooks(params);
      setBooks(data);
    } catch (err) {
      console.error(err);
      setError("Could not load books. Is the backend running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  // Initial load — every setState below happens AFTER the `await`
  // (i.e., asynchronously), which satisfies the ESLint rule.
  // `loading` already starts as `true`, so no sync setState needed.
  useEffect(() => {
    let cancelled = false;

    const loadInitialBooks = async () => {
      try {
        const { data } = await getBooks();
        if (!cancelled) setBooks(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(
            "Could not load books. Is the backend running on port 5000?",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadInitialBooks();

    // Cleanup: prevents setState if the component unmounts mid-fetch
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = (query, category) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    fetchBooks(query, category);
  };

  return (
    <div className="container py-4">
      <h2 className="section-title">Browse Books</h2>

      <SearchBar onSearch={handleSearch} />

      <p className="text-muted mt-4 mb-3">
        Showing <strong>{books.length}</strong> book
        {books.length !== 1 ? "s" : ""}
        {selectedCategory !== "All" && (
          <span>
            {" "}
            in <strong>{selectedCategory}</strong>
          </span>
        )}
        {searchQuery && (
          <span>
            {" "}
            matching &quot;<strong>{searchQuery}</strong>&quot;
          </span>
        )}
      </p>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-muted mt-2">Loading books...</p>
        </div>
      )}

      {error && <div className="alert alert-warning text-center">{error}</div>}

      {!loading && !error && books.length > 0 && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="text-center py-5">
          <div className="empty-state-icon mb-3">📭</div>
          <h5 className="fw-bold text-muted">No books found</h5>
          <p className="text-muted">Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
}

export default BooksPage;
