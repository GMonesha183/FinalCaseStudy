import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import ReviewsWrapper from "../components/ReviewsWrapper";
import "./hotel-details.css";

export default function HotelDetails() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);

    (async () => {
      try {
        // Fetch hotel details
        const all = await api.get("/hotel");
        const match = (all.data || []).find(
          (h) => String(h.hotelId) === String(hotelId)
        );
        setHotel(match || null);

        // Fetch rooms for this hotel
        const r = await api.get(`/room/hotel/${hotelId}`);
        setRooms(r.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [hotelId]);

  const handleDelete = async (room) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete room "${room.roomType}"?`
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/room/${room.roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms((prev) => prev.filter((r) => r.roomId !== room.roomId));
      alert("Room deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete room.");
    }
  };

  return (
    <div className="container hotel-details">
      {loading && <p>Loading…</p>}

      {!loading && hotel && (
        <>
          <div className="hero-card card">
            <img
              src={hotel.imageUrl || "/assets/images/default-hotel.jpg"}
              alt={hotel.name}
              onError={(e) => {
                e.currentTarget.src = "/assets/images/default-hotel.jpg";
              }}
            />
            <div className="meta">
              <h1>{hotel.name}</h1>
              <p className="loc">{hotel.location}</p>
              {hotel.description && <p className="desc">{hotel.description}</p>}
            </div>
          </div>

          {(user.role === "Admin" || user.role === "Owner") && (
            <button
              className="btn-add-room"
              onClick={() => navigate(`/hotels/${hotelId}/add-room`)}
            >
              + Add Room
            </button>
          )}

          <h3 style={{ marginTop: 24 }}>Available Rooms</h3>
          <div className="room-grid">
            {rooms.length ? (
              rooms.map((room) => (
                <div key={room.roomId} className="room-card card">
                  {room.imgUrl && <img src={room.imgUrl} alt={`Room ${room.roomId}`} />}
                  <div className="r-info">
                    <h4>{room.roomType}</h4>
                    <div className="amen">{room.amenities}</div>
                    <div className="price">₹{room.pricePerNight}</div>
                    
                    <button
                      className="btn-book"
                      disabled={!room.isAvailable}
                      onClick={() => navigate(`/book-room/${room.roomId}`)}
                    >
                      {room.isAvailable ? "Book now" : "Unavailable"}
                    </button>

                    {(user.role === "Admin" || user.role === "Owner") && (
                      <button
                        className="btn-delete-room"
                        onClick={() => handleDelete(room)}
                      >
                        Delete Room
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No rooms found.</p>
            )}
          </div>

          {/* Reviews Section */}
          <div style={{ marginTop: "40px" }}>
            <h3>Hotel Reviews</h3>
            <ReviewsWrapper />
          </div>
        </>
      )}

      {!loading && !hotel && <p>Hotel not found.</p>}
    </div>
  );
}
