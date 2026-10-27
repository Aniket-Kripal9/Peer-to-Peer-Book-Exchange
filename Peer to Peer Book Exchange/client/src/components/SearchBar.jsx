function SearchBar({
  searchTerm = '',
  onSearch,
  onSearchChange,
  placeholder = 'Search by title, author, or category...',
}) {
  const handleChange = (e) => {
    const value = e.target.value;
    if (typeof onSearchChange === 'function') {
      onSearchChange(value);
    } else if (typeof onSearch === 'function') {
      onSearch(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSearch === 'function') {
      onSearch(searchTerm);
    } else if (typeof onSearchChange === 'function') {
      onSearchChange(searchTerm);
    }
  };

  const handleClear = () => {
    if (typeof onSearchChange === 'function') {
      onSearchChange('');
    }
    if (typeof onSearch === 'function') {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="position-relative">
      <div className="input-group">
        <span className="input-group-text bg-white border-end-0 text-muted">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control border-start-0 ps-0 shadow-none"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
        />
        {searchTerm && (
          <button
            type="button"
            className="btn btn-outline-secondary border-start-0 border-end-0 text-muted"
            onClick={handleClear}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        )}
        <button type="submit" className="btn btn-primary fw-semibold px-4">
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;