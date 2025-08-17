// AddHotel.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./addhotel.css";

const AddHotel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    imageUrl: "",
  });

  // Fetch logged-in user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

  // Block unauthorized users
  if (!(user.role === "Admin" || user.role === "Owner")) {
    return (
      <div className="unauthorized">
        ❌ You are not authorized to add hotels.
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not authorized.");
      return;
    }

    try {
      await api.post(
        "/hotel",
        { ...formData, ownerId: user.userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Hotel Added: ${formData.name}`);
      navigate("/hotels");
    } catch (err) {
      console.error(err);
      alert("Failed to add hotel. Check console for details.");
    }
  };

  return (
    <div className="add-hotel-page">
      <form onSubmit={handleSubmit} className="add-hotel-form">
        <h2>Add New Hotel</h2>

        <input
          type="text"
          name="name"
          placeholder="Hotel Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
        />

        <button type="submit">Save Hotel</button>
      </form>
    </div>
  );
};

export default AddHotel;
