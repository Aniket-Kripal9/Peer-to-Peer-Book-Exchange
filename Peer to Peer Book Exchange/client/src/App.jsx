import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages (will be created in upcoming commits)
// import HomePage from './pages/HomePage';
// import BooksPage from './pages/BooksPage';
// import BookDetailPage from './pages/BookDetailPage';
// import AddBookPage from './pages/AddBookPage';
// import DashboardPage from './pages/DashboardPage';

// Components (will be created in upcoming commits)
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* <Navbar /> */}
        <main className="main-content">
          <Routes>
            {/* <Route path="/" element={<HomePage />} /> */}
            {/* <Route path="/books" element={<BooksPage />} /> */}
            {/* <Route path="/books/:id" element={<BookDetailPage />} /> */}
            {/* <Route path="/add-book" element={<AddBookPage />} /> */}
            {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
            <Route
              path="*"
              element={
                <div className="container text-center mt-5">
                  <h2>🚧 BookSwap</h2>
                  <p className="text-muted">
                    Project setup complete! Components coming soon...
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
