import { Link, useNavigate, useLocation } from "react-router-dom";
import './navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const userName = storedUser.fullName || storedUser.name || "Guest";
  const userRole = storedUser.role || "User";
  const isLoggedIn = !!storedUser && !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Helper to check if tab is active
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="nav">
      <div className="nav-row container">
        {/* Left Side */}
        <div className="nav-left">
          <Link to="/" className="brand" style={{ textDecoration: "none" }}>
            <span className="dot"></span>
            ~SNUGGLEINN~
          </Link>

          {/* Navigation Tabs (always visible) */}
          <div className="nav-tabs">
            <Link to="/hotels" className={`tab ${isActive("/hotels") ? "active" : ""}`}>
              Hotels
            </Link>
            <Link to="/bookings" className={`tab ${isActive("/bookings") ? "active" : ""}`}>
              Bookings
            </Link>
            <Link to="/reviews" className={`tab ${isActive("/reviews") ? "active" : ""}`}>
              Reviews
            </Link>
            <Link to="/refunds" className={`tab ${isActive("/refunds") ? "active" : ""}`}>
              Refunds
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="nav-right">
          {isLoggedIn ? (
            <>
              <span
                className="welcome"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/user-dashboard")}
              >
                Hi, {userName}
              </span>
              <button onClick={handleLogout} className="btn ghost">
                Logout
              </button>
              {(userRole === "Admin" || userRole === "Owner") && (
                <button onClick={() => navigate("/add-hotel")} className="btn primary">
                  + Add Hotel
                </button>
              )}
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="btn primary">
                Login
              </button>
              <button onClick={() => navigate("/register")} className="btn ghost">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
