import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api"; 
import "../pages/auth/auth.css";
import "../pages/booking.css";

export default function BookRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch room details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/room/${roomId}`);
        setRoom(res.data);
      } catch (err) {
        console.error("Error fetching room:", err);
        alert("Failed to load room details.");
      }
    };
    fetchRoom();
  }, [roomId]);

  // Handle booking submission
  const handleBooking = async () => {
    // Front-end validation
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates.");
      return;
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      alert("Check-out date must be after check-in date.");
      return;
    }
    if (guests < 1) {
      alert("Guests must be at least 1.");
      return;
    }

    // Prepare booking data
    const nights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
    const bookingData = {
      RoomId: parseInt(roomId),
      CheckInDate: checkInDate,
      CheckOutDate: checkOutDate,
      Guests: parseInt(guests),
      TotalPrice: room ? room.pricePerNight * guests * nights : 0
    };

    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      await api.post("/booking", bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Booking successful!");
      navigate("/bookings"); // Redirect to bookings page
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err.message);
      const msg = err.response?.data?.message || "Failed to create booking.";
      alert("❌ " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Book Your Stay</h2>

        {room && (
          <div className="room-info">
            <h3>{room.name}</h3>
            <p>Price: ₹{room.pricePerNight} / night</p>
          </div>
        )}

        <label>Check-in Date</label>
        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          className="a-input"
        />

        <label>Check-out Date</label>
        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          className="a-input"
        />

        <label>Guests</label>
        <input
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="a-input"
        />

        <button onClick={handleBooking} className="a-btn" disabled={loading}>
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
