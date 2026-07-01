import "./Footer.css";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
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
            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* LINKS */}

        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="#">Home</a>
          <a href="#">Vehicles</a>
          <a href="#">Packages</a>
          <a href="#">Bookings</a>
          <a href="#">Contact</a>
        </div>

        {/* SERVICES */}

        <div className="footer-links">
          <h3>Services</h3>

          <a href="./vehicles">Car Rentals</a>
          <a href="./packages">Tour Packages</a>
          <a href="./luxury-vehicles">Luxury Vehicles</a>
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
            <span>info@yatra.com</span>
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
