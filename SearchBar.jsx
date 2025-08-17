import { useState } from "react";
import "./searchbar.css";

export default function SearchBar({ onSearch }) {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);

  const submit = (e) => {
    e.preventDefault();
    onSearch?.({ destination, checkIn, checkOut, adults, rooms });
  };

  return (
    <form className="search-wrap" onSubmit={submit}>
      <div className="field grow">
        <div className="label">Destination</div>
        <input
          className="input"
          placeholder="Enter a destination or hotel"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      <div className="field">
        <div className="label">Check-in</div>
        <input
          type="date"
          className="input"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>

      <div className="field">
        <div className="label">Check-out</div>
        <input
          type="date"
          className="input"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>

      <div className="field">
        <div className="label">Guests</div>
        <select
          className="input"
          value={adults}
          onChange={(e) => setAdults(+e.target.value)}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} {n > 1 ? "adults" : "adult"}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <div className="label">Rooms</div>
        <select
          className="input"
          value={rooms}
          onChange={(e) => setRooms(+e.target.value)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} {n > 1 ? "rooms" : "room"}
            </option>
          ))}
        </select>
      </div>

      <button className="btn-cta" type="submit">
        Search
      </button>
    </form>
  );
}
