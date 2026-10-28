import "./Footer.css";

import { Link } from "react-router-dom";

import {
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LEFT */}

        <div className="footer-brand">
          <h1>YATRA</h1>

          <p>
            Premium travel and vehicle rental platform designed for modern
            explorers across Nepal.
          </p>

          <div className="social-icons">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>

            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>

            <a href="https://wa.me/9779800000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* LINKS */}

        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/vehicles">Vehicles</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/booking">Bookings</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* SERVICES */}

        <div className="footer-links">
          <h3>Services</h3>

          <Link to="/vehicles">Car Rentals</Link>
          <Link to="/packages">Tour Packages</Link>
          <Link to="/vehicles?type=Luxury">Luxury Vehicles</Link>
        </div>

        {/* CONTACT */}

        <div className="footer-contact">
          <h3>Contact</h3>

          <div className="contact-item">
            <FaMapMarkerAlt />
            <span>Kathmandu, Nepal</span>
          </div>

          <div className="contact-item">
            <FaPhoneAlt />
            <span>+977 9800000000</span>
          </div>

          <div className="contact-item">
            <FaEnvelope />
            <span>info@yatratravel.com</span>
          </div>
        </div>
      </div>

      {/* BOTTOM */}

      <div className="footer-bottom">
        <p>© 2026 YATRA Travel & Rentals. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
