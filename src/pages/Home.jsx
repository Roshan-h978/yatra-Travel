import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Footer from "../components/Footer/Footer";
import ChatBot from "../components/ChatBot/ChatBot";

import "./Home.css";

function Home() {
  const services = [
    {
      title: "Car Rentals",
      description:
        "Luxury SUVs, premium jeeps, and comfortable vehicles for every journey.",
    },

    {
      title: "Tour Packages",
      description:
        "Curated Nepal travel experiences with premium accommodations.",
    },

    {
      title: "Luxury Vehicles",
      description: "Travel in style with our modern luxury vehicle collection.",
    },
  ];

  return (
    <>
      <Navbar />

      <Hero />

      {/* SERVICES SECTION */}

      <section className="services-section">
        {/* HEADER */}

        <div className="services-header">
          <p>PREMIUM SERVICES</p>

          <h1>Explore Our Luxury Travel Services</h1>

          <span>
            Premium transportation, curated experiences, and unforgettable
            adventures designed for modern travelers.
          </span>
        </div>

        {/* SERVICES GRID */}

        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-number">0{index + 1}</div>

              <h2>{service.title}</h2>

              <p>{service.description}</p>

              <button>Explore Service</button>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE SECTION */}

      <section className="experience-section">
        <div className="experience-left">
          <p>WHY CHOOSE YATRA</p>

          <h1>Premium Nepal Travel Experience</h1>

          <span>
            Experience Nepal with luxury comfort, professional service, and
            unforgettable adventures curated for modern travelers.
          </span>

          <div className="experience-stats">
            <div className="exp-card">
              <h2>15K+</h2>

              <p>Happy Travelers</p>
            </div>

            <div className="exp-card">
              <h2>120+</h2>

              <p>Luxury Vehicles</p>
            </div>

            <div className="exp-card">
              <h2>50+</h2>

              <p>Tour Packages</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="experience-right">
          <div className="experience-image"></div>
        </div>
      </section>

      {/* DESTINATION SECTION */}

      <section className="destination-section">
        <div className="services-header">
          <p>POPULAR DESTINATIONS</p>

          <h1>Explore Beautiful Nepal</h1>
        </div>

        <div className="destination-grid">
          <div className="destination-card">
            <div className="destination-overlay">
              <h2>Pokhara</h2>
            </div>
          </div>

          <div className="destination-card second">
            <div className="destination-overlay">
              <h2>Mustang</h2>
            </div>
          </div>

          <div className="destination-card third">
            <div className="destination-overlay">
              <h2>Everest</h2>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      {/* REAL CHATBOT */}

      <ChatBot />
    </>
  );
}

export default Home;
