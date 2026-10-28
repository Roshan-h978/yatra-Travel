import "./Navbar.css";

import { useState } from "react";

import { Link, NavLink } from "react-router-dom";

import { FiGrid, FiLogIn, FiMenu, FiUser, FiX } from "react-icons/fi";

import { isAdminUser, isLoggedIn } from "../../api/api";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/vehicles", label: "Vehicles" },
  { to: "/packages", label: "Packages" },
  { to: "/booking", label: "Booking" },
  { to: "/services", label: "Services" },
];

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const loggedIn = isLoggedIn();

  const admin = loggedIn && isAdminUser();

  function closeMenu() {

    setMenuOpen(false);

  }

  return (

    <nav className="navbar">

      {/* LOGO */}

      <div className="logo">

        <Link to="/" className="logo-link" onClick={closeMenu}>

          <h1>YATRA</h1>

          <span>LUXURY TRAVEL</span>

        </Link>

      </div>

      {/* MOBILE TOGGLE (small screens only) */}

      <button
        type="button"
        className="nav-toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      <div className={`nav-menu ${menuOpen ? "open" : ""}`}>

        {/* NAVIGATION */}

        <div className="nav-links">

          {NAV_ITEMS.map((item) => (

            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>

          ))}

        </div>

        {/* BUTTONS */}

        <div className="nav-buttons">

          {!loggedIn ? (

            <Link to="/login" className="login-btn" onClick={closeMenu}>
              <FiLogIn aria-hidden="true" />
              Login
            </Link>

          ) : (

            <div className="profile-section">

              {admin && (

                <Link to="/admin" className="profile-btn" onClick={closeMenu}>
                  <FiGrid aria-hidden="true" />
                  Dashboard
                </Link>

              )}

              {/* Logout lives inside the Profile page (side menu + Security tab),
                  so it can't be clicked by accident next to "My Profile". */}
              <Link to="/profile" className="profile-btn" onClick={closeMenu}>
                <FiUser aria-hidden="true" />
                My Profile
              </Link>

            </div>

          )}

        </div>

      </div>

    </nav>

  );
}

export default Navbar;
