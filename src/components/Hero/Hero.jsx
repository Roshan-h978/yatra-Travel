import "./Hero.css";

function Hero() {

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

          <button className="hero-btn">

            Explore Packages

          </button>

        </div>

      </div>

      {/* BOOKING CARD */}

      <div className="booking-card">

        <div className="booking-field">

          <label>

            Destination

          </label>

          <select>

            <option>

              Pokhara

            </option>

            <option>

              Kathmandu

            </option>

            <option>

              Mustang

            </option>

          </select>

        </div>

        <div className="booking-field">

          <label>

            Pickup Date

          </label>

          <input type="date" />

        </div>

        <div className="booking-field">

          <label>

            Vehicle

          </label>

          <select>

            <option>

              Luxury SUV

            </option>

            <option>

              Jeep

            </option>

            <option>

              Bike

            </option>

          </select>

        </div>

        <button className="booking-btn">

          Search

        </button>

      </div>

    </section>

  );

}

export default Hero;