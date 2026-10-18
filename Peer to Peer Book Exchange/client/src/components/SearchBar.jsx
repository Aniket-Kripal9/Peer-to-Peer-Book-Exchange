import { useState } from "react";

const categories = [
  "All",
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Engineering",
  "Literature",
  "Humanities",
  "Business",
  "Other",
];

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, category);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    // Auto-trigger search when category changes
    onSearch(query, newCategory);
  };

  return (
    <form className="search-bar-wrapper" onSubmit={handleSubmit}>
      <div className="row g-3 align-items-center">
        {/* Search Input */}
        <div className="col-lg-7 col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">🔍</span>
            <input
              type="text"
              className="form-control border-start-0 search-input"
              placeholder="Search by book title or author..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="col-lg-3 col-md-3">
          <select
            className="form-select category-select"
            value={category}
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="col-lg-2 col-md-3">
          <button type="submit" className="btn btn-primary-custom w-100">
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

export default SearchBar;
