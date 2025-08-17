import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./addroom.css";

export default function AddRoom() {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    roomType: "",
    amenities: "",
    pricePerNight: "",
    imgUrl: "", // frontend field
    isAvailable: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ match backend DTO property names (ImgUrl with capital "I")
      const payload = {
        hotelId: parseInt(hotelId),
        roomType: formData.roomType,
        amenities: formData.amenities,
        pricePerNight: parseFloat(formData.pricePerNight),
        imgUrl: formData.imgUrl, // backend will map this via case-insensitive JSON, but safer to send "ImgUrl"
        isAvailable: formData.isAvailable,
      };

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await api.post(`/room`, payload, config);

      navigate(`/hotels/${hotelId}`);
    } catch (error) {
      console.error("Error adding room:", error);
      alert("Failed to add room. Please check your login or data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-room-page">
      <form className="add-room-form" onSubmit={handleSubmit}>
        <h2>Add New Room</h2>

        <input
          type="text"
          name="roomType"
          placeholder="Room Type (e.g., Deluxe Room)"
          value={formData.roomType}
          onChange={handleChange}
          required
        />

        <textarea
          name="amenities"
          placeholder="Amenities (e.g., Sea view, AC)"
          value={formData.amenities}
          onChange={handleChange}
        />

        <input
          type="number"
          name="pricePerNight"
          placeholder="Price per Night"
          value={formData.pricePerNight}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="imgUrl"
          placeholder="Image URL"
          value={formData.imgUrl}
          onChange={handleChange}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
          />
          Available
        </label>

        <button type="submit" className="btn-save" disabled={loading}>
          {loading ? "Saving..." : "Save Room"}
        </button>

        <button
          type="button"
          className="btn-cancel"
          onClick={() => navigate(`/hotels/${hotelId}`)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
