import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import "./Services.css";

function Services() {

  const rentalCars = [

    {
      name:"Toyota Prado",
      image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=2070"
    },

    {
      name:"Ford Everest",
      image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070"
    },

    {
      name:"Hyundai Creta",
      image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070"
    }

  ];

  const packages = [

    {
      name:"Pokhara Tour",
      image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070"
    },

    {
      name:"Mustang Adventure",
      image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070"
    },

    {
      name:"Everest Experience",
      image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2070"
    }

  ];

  const luxuryVehicles = [

    {
      name:"Jeep Wrangler",
      image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083"
    },

    {
      name:"Range Rover",
      image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2070"
    },

    {
      name:"Mercedes SUV",
      image:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=2070"
    }

  ];

  return (

    <>

      <Navbar />

      <section className="services-page">

        {/* HEADER */}

        <div className="services-header">

          <p>YATRA SERVICES</p>

          <h1>
            Premium Nepal
            Travel Services
          </h1>

          <span>
            Explore luxury rentals, curated tours,
            airport transportation, and unforgettable
            Nepal experiences.
          </span>

        </div>

        {/* CAR RENTALS */}

        <div className="service-section">

          <div className="section-title">

            <h2>Car Rentals</h2>

            <p>
              Premium rental vehicles for your journey.
            </p>

          </div>

          <div className="service-row">

            {rentalCars.map((car,index)=>(

              <div className="service-item" key={index}>

                <div
                  className="service-img"
                  style={{
                    backgroundImage:`url(${car.image})`
                  }}
                ></div>

                <h3>{car.name}</h3>

              </div>

            ))}

          </div>

        </div>

        {/* TOUR PACKAGES */}

        <div className="service-section">

          <div className="section-title">

            <h2>Tour Packages</h2>

            <p>
              Discover beautiful Nepal destinations.
            </p>

          </div>

          <div className="service-row">

            {packages.map((item,index)=>(

              <div className="service-item" key={index}>

                <div
                  className="service-img"
                  style={{
                    backgroundImage:`url(${item.image})`
                  }}
                ></div>

                <h3>{item.name}</h3>

              </div>

            ))}

          </div>

        </div>

        {/* LUXURY VEHICLES */}

        <div className="service-section">

          <div className="section-title">

            <h2>Luxury Vehicles</h2>

            <p>
              VIP luxury transportation experience.
            </p>

          </div>

          <div className="service-row">

            {luxuryVehicles.map((item,index)=>(

              <div className="service-item" key={index}>

                <div
                  className="service-img"
                  style={{
                    backgroundImage:`url(${item.image})`
                  }}
                ></div>

                <h3>{item.name}</h3>

              </div>

            ))}

          </div>

        </div>

      </section>

      <Footer />

    </>

  );
}

export default Services;