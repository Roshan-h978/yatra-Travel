import { useEffect,useState }

from "react";

import API from "../api/api";

import Navbar
from "../components/Navbar/Navbar";

import Footer
from "../components/Footer/Footer";

import "./Vehicles.css";

function Vehicles() {

  const [vehicles,setVehicles] =
  useState([]);

  const [loading,setLoading] =
  useState(true);

  /* FETCH VEHICLES */

  async function fetchVehicles(){
    try{
      const response = await API.get("/vehicles/");
      setVehicles(response.data);
    }
    catch(error){
      console.log(error);
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchVehicles();
  },[]);

  return (

    <>

      <Navbar />

      <section className="vehicles-page">

        {/* HEADER */}

        <div className="page-header">

          <p>
            PREMIUM FLEET
          </p>

          <h1>
            Explore Our
            Luxury Vehicles
          </h1>

          <span>
            Premium luxury vehicles,
            professional rental services,
            and unforgettable travel
            experiences across Nepal.
          </span>

        </div>

        {/* LOADING */}

        {loading && (

          <h2
            style={{
              textAlign:"center",
              marginTop:"60px"
            }}
          >
            Loading Vehicles...
          </h2>

        )}

        {/* GRID */}

        <div className="vehicle-page-grid">

          {vehicles.map((vehicle)=>(

            <div
              className="vehicle-page-card"
              key={vehicle.id}
            >

              {/* IMAGE */}

              <div
                className="vehicle-page-image"
                style={{

                  backgroundImage:
                  `url(${vehicle.image})`

                }}
              ></div>

              {/* CONTENT */}

              <div className="vehicle-page-content">

                <p className="company">

                  {vehicle.company}

                </p>

                <div className="vehicle-top">

                  <h2>

                    {vehicle.name}

                  </h2>

                </div>

                {/* SPECS */}

                <div className="specs">

                  <span>

                    {vehicle.fuel_type}

                  </span>

                  <span>

                    {vehicle.seats} Seats

                  </span>

                  <span>

                    {vehicle.transmission}

                  </span>

                </div>

                {/* DESCRIPTION */}

                <p className="vehicle-description">

                  {vehicle.description}

                </p>

                {/* PRICE */}

                <div className="price-section">

                  <h3>

                    NPR {vehicle.price_per_day}/day

                  </h3>

                  <button>

                    Book Now

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

      <Footer />

    </>

  );

}

export default Vehicles;