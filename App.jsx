import { Routes, Route } from "react-router-dom";
import "./styles/theme.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Components
import AddHotel from "./components/AddHotel";
import AddRoom from "./components/AddRoom";

// Pages
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import Bookings from "./pages/Bookings";
import Refunds from "./pages/Refunds";
import ReviewsWrapper from "./components/ReviewsWrapper"; // ✅ Wrapper to pass hotelId
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import BookRoom from "./pages/BookRoom";
import Dashboard from "./pages/DashBoard"; // ✅ Import the dashboard page

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Hotel Routes */}
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:hotelId" element={<HotelDetails />} />

        {/* Add hotel/room (Admin/Owner) */}
        <Route path="/add-hotel" element={<AddHotel />} />
        <Route path="/hotels/:hotelId/add-room" element={<AddRoom />} />

        {/* Hotel-specific Reviews */}
        <Route path="/hotels/:hotelId/reviews" element={<ReviewsWrapper />} />

        {/* Other core pages */}
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/refunds" element={<Refunds />} />
        <Route path="/book-room/:roomId" element={<BookRoom />} />

        {/* User Dashboard */}
        <Route path="/user-dashboard" element={<Dashboard />} />

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
              <h2>404 – Page Not Found</h2>
            </div>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}
