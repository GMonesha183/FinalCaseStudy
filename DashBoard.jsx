import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../pages/dashboard.css";

// Import the avatar image
import UserAvatar from "../assets/images/user-avatar.jpg";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsCount, setReviewsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        navigate("/login");
        return;
      }
      setUser(storedUser);
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch user-specific reviews count only for Guest users
  useEffect(() => {
    const fetchReviews = async () => {
      if (!user || user.role !== "Guest") return;
      try {
        const res = await api.get(`/review/my`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setReviewsCount(res.data.length);
      } catch (err) {
        console.error("Error fetching user reviews:", err);
        setError("Failed to fetch reviews count.");
      }
    };
    fetchReviews();
  }, [user]);

  if (loading) return <p>Loading dashboard...</p>;
  if (!user) return null;

  // Use imported user-avatar image
  const profileImage = UserAvatar;

  return (
    <div className="dashboard-container">
      <div className="user-info">
        <img src={profileImage} alt="User Avatar" className="user-avatar" />
        <div>
          <h2>Welcome, {user.fullName}!</h2>
          <p><b>Email</b>: {user.email}</p>
          <p><b>Role</b>: {user.role}</p>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="dashboard-cards">
        {user.role === "Guest" && (
          <div className="card">
            <h3>My Reviews</h3>
            <p>{reviewsCount}</p>
          </div>
        )}
        {/* Add more cards for bookings, refunds, etc. */}
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
