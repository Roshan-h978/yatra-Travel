import "./Hero.css";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

const DESTINATIONS = ["Kathmandu", "Pokhara", "Mustang", "Chitwan", "Everest"];

import { VEHICLE_TYPES } from "../../constants/vehicles";

function Hero() {

  const navigate = useNavigate();

  const [destination, setDestination] = useState("");

  const [vehicleType, setVehicleType] = useState("");

  // A destination searches tour packages; otherwise search vehicles.
  function handleSearch(e) {

    e.preventDefault();

    if (destination) {

      navigate(`/packages?location=${encodeURIComponent(destination)}`);

    } else {

      navigate(vehicleType ? `/vehicles?type=${encodeURIComponent(vehicleType)}` : "/vehicles");

    }

  }

  return (

    <section className="hero">

      {/* SLIDER */}

      <div className="hero-slider">

        <div className="slide slide1"></div>

        <div className="slide slide2"></div>

        <div className="slide slide3"></div>

        <div className="slide slide4"></div>

      </div>

      {/* OVERLAY */}

      <div className="hero-overlay"></div>

      {/* CONTENT */}

      <div className="hero-content">

        <p className="hero-tag">

          PREMIUM CAR RENTAL & TRAVEL EXPERIENCE

        </p>

        <h1>

          Start Your Unforgettable Journey With Us

        </h1>

        <p className="hero-description">

          Luxury vehicle rentals, curated Nepal tours,
          and premium travel experiences.

        </p>

        <div className="hero-buttons">

          <button className="hero-btn" onClick={() => navigate("/packages")}>

            Explore Packages

          </button>

        </div>

      </div>

      {/* SEARCH CARD */}

      <form className="hero-search-card" onSubmit={handleSearch}>

        <div className="booking-field">

          <label htmlFor="hero-destination">

            Destination

          </label>

          <select
            id="hero-destination"
            value={destination}
            onChange={(e) => { setDestination(e.target.value); setVehicleType(""); }}
          >

            <option value="">Any destination</option>

            {DESTINATIONS.map((d) => <option key={d}>{d}</option>)}

          </select>

        </div>

        <div className="booking-field">

          <label htmlFor="hero-vehicle-type">

            Vehicle Type

          </label>

          <select
            id="hero-vehicle-type"
            value={vehicleType}
            onChange={(e) => { setVehicleType(e.target.value); setDestination(""); }}
          >

            <option value="">Any vehicle</option>

            {VEHICLE_TYPES.map((t) => <option key={t}>{t}</option>)}

          </select>

        </div>

        <button type="submit" className="booking-btn">

          Search

        </button>

      </form>

    </section>

  );

}

export default Hero;