import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";
import "./hotels.css";

export default function Hotels() {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(searchParams.get("destination") || "");
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);

    (async () => {
      try {
        const res = await api.get("/hotel");
        const apiHotels = res.data || [];
        const localHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
        setHotels([...apiHotels, ...localHotels]);
      } catch (err) {
        console.error(err);
        const localHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
        setHotels(localHotels);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (hotel) => {
    const confirm = window.confirm(`Are you sure you want to delete "${hotel.name}"?`);
    if (!confirm) return;

    try {
      if (hotel.hotelId) {
        const token = localStorage.getItem("token");
        await api.delete(`/hotel/${hotel.hotelId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const localHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
        const updated = localHotels.filter((h) => h !== hotel);
        localStorage.setItem("hotels", JSON.stringify(updated));
      }

      setHotels((prev) => prev.filter((h) => h !== hotel));
      alert("Hotel removed successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to remove hotel.");
    }
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return hotels;
    return hotels.filter(
      (h) =>
        (h.name || "").toLowerCase().includes(s) ||
        (h.location || "").toLowerCase().includes(s)
    );
  }, [hotels, q]);

  return (
    <div className="container hotels-page">
      <div className="list-head">
        <h2>Available Hotels</h2>
        <input
          className="q"
          placeholder="Search by name or location…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="hotel-grid">
          {filtered.map((hotel, idx) => (
            <div key={hotel.hotelId || idx} className="hotel-card card">
              <Link to={`/hotels/${hotel.hotelId || idx}`}>
                <img
                  src={hotel.imageUrl || hotel.image || "/assets/images/default-hotel.jpg"}
                  alt={hotel.name}
                  onError={(e) => { e.currentTarget.src = "/assets/images/default-hotel.jpg"; }}
                />
                <div className="info">
                  <h3>{hotel.name}</h3>
                  <p className="loc">{hotel.location}</p>
                  {hotel.description && <p className="amen">{hotel.description}</p>}
                  <div className="cta-row">
                    <span className="badge">View rooms</span>
                  </div>
                </div>
              </Link>

              {(user.role === "Admin" || user.role === "Owner") && (
                <button
                  onClick={() => handleDelete(hotel)}
                  className="delete-btn"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          {!filtered.length && <p>No hotels matched your search.</p>}
        </div>
      )}
    </div>
  );
}
