import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import API from "../api/api";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import "./Services.css";

// Shows up to 3 items per row; "View all" links to the full list.
function ServiceRow({ title, subtitle, items, loading, viewAll, linkFor, nameFor }) {

  return (

    <div className="service-section">

      <div className="section-title">

        <h2>{title}</h2>

        <p>
          {subtitle}
        </p>

        <Link to={viewAll} className="service-view-all">View all →</Link>

      </div>

      <div className="service-row">

        {loading && <p className="state-message">Loading...</p>}

        {!loading && items.length === 0 && (
          <p className="state-message">Nothing available right now.</p>
        )}

        {items.slice(0, 3).map((item)=>(

          <Link to={linkFor(item)} className="service-item" key={item.id}>

            <div
              className="service-img"
              style={
                item.image
                  ? { backgroundImage:`url(${item.image})` }
                  : undefined
              }
            ></div>

            <h3>{nameFor(item)}</h3>

          </Link>

        ))}

      </div>

    </div>

  );

}

function Services() {

  const [vehicles,setVehicles] = useState([]);

  const [packages,setPackages] = useState([]);

  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    Promise.allSettled([API.get("/vehicles/"), API.get("/packages/")])
      .then(([vehicleRes, packageRes])=>{
        if (vehicleRes.status === "fulfilled") setVehicles(vehicleRes.value.data);
        if (packageRes.status === "fulfilled") setPackages(packageRes.value.data);
      })
      .finally(()=>setLoading(false));

  },[]);

  // Vehicles under maintenance can't be booked, so don't advertise them here.
  const bookable = vehicles.filter((v)=>v.status !== "Maintenance");

  const rentalCars = bookable.filter((v)=>v.vehicle_type !== "Luxury");

  const luxuryVehicles = bookable.filter((v)=>v.vehicle_type === "Luxury");

  const vehicleLink = (v)=>`/booking?vehicle=${v.id}`;

  const vehicleName = (v)=>`${v.brand} ${v.name}`;

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

        <ServiceRow
          title="Car Rentals"
          subtitle="Premium rental vehicles for your journey."
          items={rentalCars}
          loading={loading}
          viewAll="/vehicles"
          linkFor={vehicleLink}
          nameFor={vehicleName}
        />

        <ServiceRow
          title="Tour Packages"
          subtitle="Discover beautiful Nepal destinations."
          items={packages}
          loading={loading}
          viewAll="/packages"
          linkFor={(p)=>`/booking?package=${p.id}`}
          nameFor={(p)=>p.title}
        />

        <ServiceRow
          title="Luxury Vehicles"
          subtitle="VIP luxury transportation experience."
          items={luxuryVehicles}
          loading={loading}
          viewAll="/vehicles?type=Luxury"
          linkFor={vehicleLink}
          nameFor={vehicleName}
        />

      </section>

      <Footer />

    </>

  );

}

export default Services;
