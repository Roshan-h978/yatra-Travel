import { useState } from "react";

import API, { getErrorMessage } from "../api/api";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import "./Contact.css";

const EMPTY_FORM = { name: "", email: "", phone: "", subject: "", message: "" };

function Contact() {

  const [form, setForm] = useState(EMPTY_FORM);

  const [sending, setSending] = useState(false);

  const [status, setStatus] = useState(null);

  function handleChange(e) {

    setForm({ ...form, [e.target.name]: e.target.value });

  }

  async function handleSubmit(e) {

    e.preventDefault();

    setSending(true);

    setStatus(null);

    try {

      await API.post("/support/create/", {
        customer_name: form.name,
        email: form.email,
        subject: form.subject,
        // The support model has no phone field, so include it in the message.
        message: form.phone ? `${form.message}

Phone: ${form.phone}` : form.message,
      });

      setStatus({ type: "success", text: "Thanks! Your message has been sent. We'll reply by email." });

      setForm(EMPTY_FORM);

    } catch (err) {

      setStatus({ type: "error", text: getErrorMessage(err, "Could not send your message. Please try again.") });

    } finally {

      setSending(false);

    }

  }


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

            <form className="contact-form" onSubmit={handleSubmit}>

              {status && (
                <div className={`form-message ${status.type}`} role="status">{status.text}</div>
              )}

              <div className="form-group">
                <label htmlFor="contact-name">Full Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-phone">Phone Number (optional)</label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="Enter subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Write your message..."
                  value={form.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Message"}
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