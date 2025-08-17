import { useRef } from "react";
import { useNavigate, createSearchParams, Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import bgImage from "../assets/images/background.jpg";
import "../components/searchbar.css";

export default function Home() {
  const navigate = useNavigate();

  // Get logged-in user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const userName = storedUser.fullName || "Guest"; // ✅ matches Login.jsx now
  const userRole = storedUser.role || "user";

  // Refs for horizontal scroll
  const topDestinationsRef = useRef(null);
  const featuredHomesRef = useRef(null);
  const popularOutsideRef = useRef(null);

  const handleSearch = (q) => {
    navigate({
      pathname: "/hotels",
      search: `?${createSearchParams(q)}`,
    });
  };

  const scroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const topDestinationsIndia = [
    { name: "Chennai", img: "/images/chennai.jpg", stays: "16,445 accommodations" },
    { name: "New Delhi and NCR", img: "/images/delhi.jpg", stays: "12,786 accommodations" },
    { name: "Bangalore", img: "/images/bangalore.jpeg", stays: "5,372 accommodations" },
    { name: "Mumbai", img: "/images/mumbai.jpg", stays: "4,177 accommodations" },
    { name: "Hyderabad", img: "/images/hyderabad.jpg", stays: "2,735 accommodations" },
    { name: "Goa", img: "/images/goa.jpg", stays: "9,254 accommodations" },
  ];

  const featuredHomes = [
    { name: "Cozy Villa in Goa", img: "/images/villa1.jpg", stays: "Villa • 4 guests" },
    { name: "Apartment in Mumbai", img: "/images/apartment1.jpg", stays: "Apartment • 2 guests" },
    { name: "Beach House in Bali", img: "/images/beachhouse.jpg", stays: "House • 6 guests" },
  ];

  const popularOutsideIndia = [
    { name: "Dubai", img: "/images/dubai.jpg", stays: "19,464 accommodations" },
    { name: "Bangkok", img: "/images/bangkok.jpg", stays: "12,048 accommodations" },
    { name: "South Korea", img: "/images/southkorea.jpg", stays: "721 accommodations" },
    { name: "Bali", img: "/images/bali.jpg", stays: "32,908 accommodations" },
    { name: "Pattaya", img: "/images/pattaya.jpg", stays: "11,909 accommodations" },
  ];

  const handleDestinationClick = (city) => {
    navigate({
      pathname: "/hotels",
      search: `?${createSearchParams({ city })}`,
    });
  };

  return (
    <>
      {/* Navbar */}
   

      {/* Hero Section */}
      <div className="search-hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="hero-container">
          <h1 className="hero-title">Book.Stay.Smile</h1>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Top Destinations */}
      <div className="section">
        <h2 className="section-title">Top destinations in India</h2>
        <div className="cards-wrapper">
          <button className="scroll-btn left" onClick={() => scroll(topDestinationsRef, "left")}>‹</button>
          <div className="cards" ref={topDestinationsRef}>
            {topDestinationsIndia.map((d, i) => (
              <div key={i} className="card" onClick={() => handleDestinationClick(d.name)}>
                <img src={d.img} alt={d.name} className="card-img" />
                <h3 className="card-title">{d.name}</h3>
                <p className="card-sub">{d.stays}</p>
              </div>
            ))}
          </div>
          <button className="scroll-btn right" onClick={() => scroll(topDestinationsRef, "right")}>›</button>
        </div>
      </div>

      {/* Featured Homes */}
      <div className="section">
        <h2 className="section-title">Featured homes recommended for you</h2>
        <div className="cards-wrapper">
          <button className="scroll-btn left" onClick={() => scroll(featuredHomesRef, "left")}>‹</button>
          <div className="cards" ref={featuredHomesRef}>
            {featuredHomes.map((home, i) => (
              <div key={i} className="card">
                <img src={home.img} alt={home.name} className="card-img" />
                <h3 className="card-title">{home.name}</h3>
                <p className="card-sub">{home.stays}</p>
              </div>
            ))}
          </div>
          <button className="scroll-btn right" onClick={() => scroll(featuredHomesRef, "right")}>›</button>
        </div>
      </div>

      {/* Popular Destinations Outside India */}
      <div className="section">
        <h2 className="section-title">Popular destinations outside India</h2>
        <div className="cards-wrapper">
          <button className="scroll-btn left" onClick={() => scroll(popularOutsideRef, "left")}>‹</button>
          <div className="cards" ref={popularOutsideRef}>
            {popularOutsideIndia.map((d, i) => (
              <div key={i} className="card" onClick={() => handleDestinationClick(d.name)}>
                <img src={d.img} alt={d.name} className="card-img" />
                <h3 className="card-title">{d.name}</h3>
                <p className="card-sub">{d.stays}</p>
              </div>
            ))}
          </div>
          <button className="scroll-btn right" onClick={() => scroll(popularOutsideRef, "right")}>›</button>
        </div>
      </div>
    </>
  );
}
