import { useEffect,useState }

from "react";

import API from "../api/api";

import Navbar
from "../components/Navbar/Navbar";

import Footer
from "../components/Footer/Footer";

import "./Packages.css";

function Packages() {

  const [packages,setPackages] =
  useState([]);

  const [loading,setLoading] =
  useState(true);

  /* FETCH PACKAGES */

  async function fetchPackages(){
    try{
      const response = await API.get("/packages/");
      setPackages(response.data);
    }
    catch(error){
      console.log(error);
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchPackages();
  },[]);

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

        {/* LOADING */}

        {loading && (

          <h2
            style={{
              textAlign:"center",
              marginTop:"60px"
            }}
          >
            Loading Packages...
          </h2>

        )}

        {/* GRID */}

        <div className="packages-grid">

          {packages.map((item)=>(

            <div
              className="package-card"
              key={item.id}
            >

              {/* IMAGE */}

              <div
                className="package-image"
                style={{

                  backgroundImage:
                  `url(${item.image})`

                }}
              ></div>

              {/* CONTENT */}

              <div className="package-content">

                <p className="package-location">

                  {item.location}

                </p>

                <h2>

                  {item.name}

                </h2>

                <p className="package-description">

                  {item.description}

                </p>

                {/* DETAILS */}

                <div className="package-details">

                  <span>

                    {item.duration}

                  </span>

                  <span>

                    {item.group_size}

                  </span>

                </div>

                {/* PRICE */}

                <div className="package-price">

                  <h3>

                    NPR {item.price}

                  </h3>

                  <button>

                    Explore

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