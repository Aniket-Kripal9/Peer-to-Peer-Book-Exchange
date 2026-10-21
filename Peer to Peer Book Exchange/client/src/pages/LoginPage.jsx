import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirect existing logged in user to Dashboard
    navigate("/dashboard");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <i className="bi bi-person-circle fs-1 text-primary"></i>
                <h3
                  className="fw-bold mt-2"
                  style={{ color: "var(--primary-color)" }}
                >
                  Welcome Back
                </h3>
                <p className="text-muted small">
                  Login to access your book exchanges
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-semibold mb-3"
                >
                  Login
                </button>
              </form>

              <div className="text-center mt-3 fs-6">
                <span className="text-muted">Don't have an account? </span>
                <Link to="/signup" className="text-decoration-none fw-semibold">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
