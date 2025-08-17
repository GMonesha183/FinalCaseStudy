import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; 
import "../pages/auth/auth.css";
import "../pages/booking.css";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get user info and token from localStorage
  let user = null;
  let token = null;
  let role = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
    token = user?.token;
    role = user?.role;
  } catch {
    console.warn("Failed to parse user from localStorage");
  }
  const normalizedRole = role?.toLowerCase();

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      const endpoint = normalizedRole === "guest" ? "/Booking/user" : "/Booking";
      try {
        const res = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data || []);
      } catch (err) {
        console.error("Error fetching bookings:", err.response || err);
        setError(err.response?.status === 403
          ? "You are not authorized to view these bookings."
          : "Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [navigate, token, normalizedRole]);

  // Cancel a booking
  const handleCancelBooking = async (bookingId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await api.delete(`/Booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
      alert("Booking cancelled successfully.");
    } catch (err) {
      console.error("Error cancelling booking:", err.response || err);
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Status badge helper
  const getStatusBadge = (status) => {
    const normalized = status?.toLowerCase();
    let badgeClass = "status-badge";
    if (normalized === "confirmed") badgeClass += " confirmed";
    else if (normalized === "pending") badgeClass += " pending";
    else if (normalized === "cancelled") badgeClass += " cancelled";
    return <span className={badgeClass}>{status || "Unknown"}</span>;
  };

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>

      {normalizedRole === "guest" && (
        <p style={{ color: "darkred", fontWeight: "bold" }}>
          Note: In case of refund, please note your Booking ID.
        </p>
      )}

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking.bookingId} className="booking-card">
              <h3>Hotel: {booking.hotelName || "Unknown"}</h3>
              <p>Booking ID: <strong>{booking.bookingId}</strong></p>
              <p>Room ID: {booking.roomId}</p>
              <p>
                Check-in:{" "}
                {booking.checkInDate
                  ? new Date(booking.checkInDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                Check-out:{" "}
                {booking.checkOutDate
                  ? new Date(booking.checkOutDate).toLocaleDateString()
                  : "N/A"}
              </p>
              {booking.guests && <p>Guests: {booking.guests}</p>}
              {booking.totalPrice && <p>Total Price: ₹{booking.totalPrice}</p>}
              <p>Status: {getStatusBadge(booking.status)}</p>

              {normalizedRole === "guest" && booking.status?.toLowerCase() !== "cancelled" && (
                <button
                  onClick={() => handleCancelBooking(booking.bookingId)}
                  className="cancel-btn"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
