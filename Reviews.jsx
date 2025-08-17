import { useEffect, useState } from "react";
import axios from "axios";
import "./review.css";

export default function Reviews({ hotelId, token, user }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`https://localhost:7032/api/review/hotel/${hotelId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [hotelId]);

  // Compute average rating
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("HotelId", hotelId);
      formData.append("Rating", rating);
      formData.append("Comment", comment);
      if (file) formData.append("file", file);

      await axios.post(
        "https://localhost:7032/api/review/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form
      setRating(5);
      setComment("");
      setFile(null);
      fetchReviews();
    } catch (err) {
      console.error("Error posting review:", err);
    } finally {
      setLoading(false);
    }
  };

  // Soft delete review (Admin/Owner)
  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`https://localhost:7032/api/review/delete/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchReviews();
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  // Render stars
  const renderStars = (currentRating, setFunc) => {
    return [1, 2, 3, 4, 5].map((n) => (
      <span
        key={n}
        className={`star ${n <= currentRating ? "filled" : ""}`}
        onClick={() => setFunc && setFunc(n)}
      >
        &#9733;
      </span>
    ));
  };

  return (
    <div className="container py-4">
      <h2>Reviews</h2>

      {/* Average Rating */}
      {reviews.length > 0 && (
        <div className="mb-3">
          <strong>Average Rating:</strong>{" "}
          {renderStars(Math.round(avgRating))}
          <span> ({avgRating} / 5 from {reviews.length} review{reviews.length !== 1 && "s"})</span>
        </div>
      )}

      {/* Add Review Form (Guests) */}
      {token && user.role === "Guest" && (
        <div className="mb-4">
          <h5>Add a Review</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label>Rating:</label>
              <div className="star-select">{renderStars(rating, setRating)}</div>
            </div>

            <div className="mb-2">
              <label>Comment:</label>
              <textarea
                className="form-control"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label>File (optional):</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post Review"}
            </button>
          </form>
        </div>
      )}

      {/* Display Reviews */}
      <div>
        <h5>All Reviews</h5>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.reviewId} className="card mb-2 p-2 review-card">
              <strong>User ID:</strong> {r.userId} <br />
              <strong>Rating:</strong> {renderStars(r.rating)} <br />
              <strong>Comment:</strong> {r.comment} <br />
              {r.filePath && (
                <div>
                  <strong>File:</strong>{" "}
                  <a href={`https://localhost:7032/${r.filePath}`} target="_blank" rel="noreferrer">
                    View
                  </a>
                </div>
              )}
              <small className="text-muted">
                Posted: {new Date(r.createdAt).toLocaleString()}
              </small>

              {/* Admin/Owner soft delete */}
              {token && (user.role === "Admin" || user.role === "Owner") && (
                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => handleDelete(r.reviewId)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
