import { useEffect,useState }
from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import API from "../api/api";

import Navbar
from "../components/Navbar/Navbar";

import Footer
from "../components/Footer/Footer";

import "./Packages.css";

function Packages() {

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const location = searchParams.get("location") || "";

  const [packages,setPackages] =
  useState([]);

  const [loading,setLoading] =
  useState(true);

  const [error,setError] =
  useState("");

  /* FETCH PACKAGES */

  useEffect(()=>{

    API.get("/packages/")
      .then((response)=>setPackages(response.data))
      .catch(()=>setError("Could not load packages. Please try again later."))
      .finally(()=>setLoading(false));

  },[]);

  const visiblePackages = location
    ? packages.filter((item)=>
        `${item.location} ${item.title}`.toLowerCase().includes(location.toLowerCase())
      )
    : packages;

  return (

    <>

      <Navbar />

      <section className="packages-page">

        {/* HEADER */}

        <div className="packages-header">

          <p>
            NEPAL TOURS
          </p>

          <h1>
            Explore Premium
            Nepal Packages
          </h1>

          <span>
            Luxury travel experiences,
            curated Nepal adventures,
            and unforgettable destinations.
          </span>

        </div>

        {location && (

          <div className="filter-chip-row">

            <span className="filter-chip">
              Destination: {location}
              <button type="button" aria-label="Clear filter" onClick={()=>setSearchParams({})}>×</button>
            </span>

          </div>

        )}

        {/* GRID */}

        <div className="packages-grid">

          {loading && <p className="state-message">Loading packages...</p>}

          {error && <p className="state-message">{error}</p>}

          {!loading && !error && visiblePackages.length === 0 && (
            <p className="state-message">No packages found.</p>
          )}

          {visiblePackages.map((item)=>(

            <div
              className="package-card"
              key={item.id}
            >

              {/* IMAGE */}

              <div
                className="package-image"
                style={
                  item.image
                    ? { backgroundImage:`url(${item.image})` }
                    : undefined
                }
              ></div>

              {/* CONTENT */}

              <div className="package-content">

                <div className="package-top">

                  <p>
                    {item.location}
                  </p>

                  <h2>
                    {item.title}
                  </h2>

                </div>

                <p className="package-description">
                  {item.description}
                </p>

                {/* DETAILS */}

                <div className="package-details">

                  <span>
                    {item.duration}
                  </span>

                  <span>
                    ★ {item.rating}
                  </span>

                  {item.is_featured && (
                    <span>Featured</span>
                  )}

                </div>

                {/* PRICE */}

                <div className="package-bottom">

                  <h3>
                    NPR {item.price.toLocaleString()}
                  </h3>

                  <button
                    type="button"
                    onClick={()=>navigate(`/booking?package=${item.id}`)}
                  >
                    Book Package
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

export default Packages;
