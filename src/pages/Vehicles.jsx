import { useEffect,useState }
from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import API from "../api/api";

import Navbar
from "../components/Navbar/Navbar";

import Footer
from "../components/Footer/Footer";

import "./Vehicles.css";

const VEHICLE_TYPES = ["SUV", "Luxury", "Jeep", "Bike"];

function Vehicles() {

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const type = searchParams.get("type") || "";

  const [vehicles,setVehicles] =
  useState([]);

  const [loading,setLoading] =
  useState(true);

  const [error,setError] =
  useState("");

  /* FETCH VEHICLES */

  useEffect(()=>{

    API.get("/vehicles/")
      .then((response)=>setVehicles(response.data))
      .catch(()=>setError("Could not load vehicles. Please try again later."))
      .finally(()=>setLoading(false));

  },[]);

  const visibleVehicles = type
    ? vehicles.filter((v)=>v.vehicle_type === type)
    : vehicles;

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

        {/* FILTER */}

        <div className="filter-chip-row">

          {["", ...VEHICLE_TYPES].map((t)=>(

            <button
              key={t || "all"}
              type="button"
              className={`filter-tab ${type === t ? "active" : ""}`}
              onClick={()=>setSearchParams(t ? { type:t } : {})}
            >
              {t || "All"}
            </button>

          ))}

        </div>

        {/* GRID */}

        <div className="vehicle-page-grid">

          {loading && <p className="state-message">Loading vehicles...</p>}

          {error && <p className="state-message">{error}</p>}

          {!loading && !error && visibleVehicles.length === 0 && (
            <p className="state-message">No vehicles found.</p>
          )}

          {visibleVehicles.map((vehicle)=>(

            <div
              className="vehicle-page-card"
              key={vehicle.id}
            >

              {/* IMAGE */}

              <div
                className="vehicle-page-image"
                style={
                  vehicle.image
                    ? { backgroundImage:`url(${vehicle.image})` }
                    : undefined
                }
              >

                <span className={`vehicle-status-badge ${vehicle.status.toLowerCase()}`}>
                  {vehicle.status}
                </span>

              </div>

              {/* CONTENT */}

              <div className="vehicle-page-content">

                <p className="company">
                  {vehicle.brand} · {vehicle.rental_type}
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
                    NPR {vehicle.price_per_day.toLocaleString()}/day
                  </h3>

                  <button
                    type="button"
                    disabled={vehicle.status === "Maintenance"}
                    onClick={()=>navigate(`/booking?vehicle=${vehicle.id}`)}
                  >
                    {vehicle.status === "Maintenance" ? "Unavailable" : "Book Now"}
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
