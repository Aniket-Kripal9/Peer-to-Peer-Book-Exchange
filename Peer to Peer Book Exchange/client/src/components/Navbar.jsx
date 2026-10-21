import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Auth pages: Login / Signup
  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  const handleSignOut = () => {
    // UI-only sign out → back to Login
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top shadow-sm navbar-custom">
      <div className="container">
        <Link
          className="navbar-brand fw-bold fs-4 d-flex align-items-center"
          to={isAuthPage ? "/" : "/home"}
        >
          <i className="bi bi-journal-bookmark-fill me-2 text-warning"></i>
          BookSwap
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {isAuthPage ? (
              // ---------- LOGIN / SIGNUP PAGES ----------
              <>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="btn btn-outline-primary btn-sm px-3 ms-2 me-1"
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/signup"
                    className="btn btn-outline-warning btn-sm px-3 fw-semibold"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              // ---------- AFTER LOGIN (APP PAGES) ----------
              <>
                <li className="nav-item">
                  <NavLink className="nav-link px-3" to="/home">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link px-3" to="/books">
                    Browse Books
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link px-3" to="/add-book">
                    Add Book
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link px-3" to="/dashboard">
                    Dashboard
                  </NavLink>
                </li>

                <li className="nav-item ms-lg-2">
                  <span className="navbar-text fw-semibold text-info px-2">
                    Hi, Aniket
                  </span>
                </li>

                <li className="nav-item">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="btn btn-outline-danger btn-sm px-3 ms-2"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
