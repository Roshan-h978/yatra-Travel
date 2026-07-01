import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import "./Contact.css";

function Contact() {

  return (

    <>

      <Navbar />

      <section className="contact-page">

        {/* HEADER */}

        <div className="contact-header">

          <p>GET IN TOUCH</p>

          <h1>
            Contact Yatra Travel & Rentals
          </h1>

          <span>
            We are here to help you plan unforgettable
            journeys across Nepal with luxury travel experiences.
          </span>

        </div>

        {/* CONTACT CONTAINER */}

        <div className="contact-container">

          {/* LEFT SIDE */}

          <div className="contact-left">

            <h2>
              Send Us A Message
            </h2>

            <form className="contact-form">

              <div className="form-group">

                <label>Full Name</label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                />

              </div>

              <div className="form-group">

                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                />

              </div>

              <div className="form-group">

                <label>Phone Number</label>

                <input
                  type="text"
                  placeholder="Enter your phone number"
                />

              </div>

              <div className="form-group">

                <label>Subject</label>

                <input
                  type="text"
                  placeholder="Enter subject"
                />

              </div>

              <div className="form-group">

                <label>Message</label>

                <textarea
                  placeholder="Write your message..."
                ></textarea>

              </div>

              <button
                type="submit"
                className="contact-submit-btn"
              >
                Send Message
              </button>

            </form>

          </div>

          {/* RIGHT SIDE */}

          <div className="contact-right">

            {/* INFO CARD */}

            <div className="contact-card">

              <h3>
                Contact Information
              </h3>

              <div className="contact-info">

                <div className="info-item">

                  <h4>Office Location</h4>

                  <p>Kathmandu, Nepal</p>

                </div>

                <div className="info-item">

                  <h4>Phone Number</h4>

                  <p>+977 9800000000</p>

                </div>

                <div className="info-item">

                  <h4>Email Address</h4>

                  <p>info@yatratravel.com</p>

                </div>

                <div className="info-item">

                  <h4>Working Hours</h4>

                  <p>Sunday - Friday | 9 AM - 7 PM</p>

                </div>

              </div>

            </div>

            {/* IMAGE */}

            <div className="contact-image"></div>

          </div>

        </div>

      </section>

      <Footer />

    </>

  );
}

export default Contact;