import { useState, useMemo } from "react";
import BookCard from "../components/BookCard";
import SearchBar from "../components/SearchBar";

// Dummy data — will be replaced with API calls later
const allBooks = [
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
  {
    _id: "5",
    title: "Operating System Concepts",
    author: "Silberschatz, Galvin",
    category: "Computer Science",
    condition: "Good",
    available: true,
    image: "https://via.placeholder.com/300x400?text=OS",
  },
  {
    _id: "6",
    title: "University Physics",
    author: "Young & Freedman",
    category: "Physics",
    condition: "Like New",
    available: true,
    image: "https://via.placeholder.com/300x400?text=Physics",
  },
  {
    _id: "7",
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    category: "Business",
    condition: "Good",
    available: true,
    image: "https://via.placeholder.com/300x400?text=Economics",
  },
  {
    _id: "8",
    title: "Molecular Biology of the Cell",
    author: "Bruce Alberts",
    category: "Biology",
    condition: "Fair",
    available: true,
    image: "https://via.placeholder.com/300x400?text=Biology",
  },
];

function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleSearch = (query, category) => {
    setSearchQuery(query);
    setSelectedCategory(category);
  };

  // Filter books based on search query and category
  const filteredBooks = useMemo(() => {
    return allBooks.filter((book) => {
      const matchesQuery =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || book.category === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="container py-4">
      {/* Page Header */}
      <h2 className="section-title">Browse Books</h2>

      {/* Search & Filter Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Results Count */}
      <p className="text-muted mt-4 mb-3">
        Showing <strong>{filteredBooks.length}</strong> of{" "}
        <strong>{allBooks.length}</strong> books
        {selectedCategory !== "All" && (
          <span>
            {" "}
            in <strong>{selectedCategory}</strong>
          </span>
        )}
        {searchQuery && (
          <span>
            {" "}
            matching "<strong>{searchQuery}</strong>"
          </span>
        )}
      </p>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="empty-state-icon mb-3">📭</div>
          <h5 className="fw-bold text-muted">No books found</h5>
          <p className="text-muted">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}

export default BooksPage;
