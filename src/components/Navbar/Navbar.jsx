import "./Navbar.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {

  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("yatraUser"))
  );

  function handleLogout() {

    localStorage.removeItem("yatraUser");

    navigate("/login");

    window.location.reload();

  }

  return (

    <nav className="navbar">

      {/* LOGO */}

      <div className="logo">

        <Link to="/" className="logo-link">

          <h1>YATRA</h1>

          <span>LUXURY TRAVEL</span>

        </Link>

      </div>

      {/* NAVIGATION */}

      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/vehicles">Vehicles</Link>

        <Link to="/packages">Packages</Link>

        <Link to="/booking">Booking</Link>

        <Link to="/services">Services</Link>

      </div>

      {/* BUTTONS */}

      <div className="nav-buttons">

        {!loggedIn ? (

          <>

            <Link to="/login">

              <button className="login-btn">
                Login
              </button>

            </Link>

          </>

        ) : (

          <div className="profile-section">

            <Link to="/profile">

              <button className="profile-btn">
                My Profile
              </button>

            </Link>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        )}

      </div>

    </nav>

  );
}

export default Navbar;