import { useEffect, useMemo, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import API, { getErrorMessage, getStoredUser } from "../api/api";

import Navbar from "../components/Navbar/Navbar";

import Footer from "../components/Footer/Footer";

import { localToday, tripDays } from "../utils/dates";

import "./Booking.css";

function Booking() {

  const [searchParams] = useSearchParams();

  const storedUser = getStoredUser();

  const today = localToday();

  /* STATES */

  const [fullName,setFullName] =
  useState(storedUser?.name || "");

  const [email,setEmail] =
  useState(storedUser?.email || "");

  const [phone,setPhone] =
  useState("");

  const [vehicleId,setVehicleId] =
  useState(searchParams.get("vehicle") || "");

  const [packageId,setPackageId] =
  useState(searchParams.get("package") || "");

  const [pickupDate,setPickupDate] =
  useState("");

  const [returnDate,setReturnDate] =
  useState("");

  const [notes,setNotes] =
  useState("");

  const [vehicles,setVehicles] =
  useState([]);

  const [packages,setPackages] =
  useState([]);

  const [loading,setLoading] =
  useState(false);

  const [message,setMessage] =
  useState(null);

  /* LOAD OPTIONS */

  useEffect(()=>{

    API.get("/vehicles/")
      .then((res)=>setVehicles(res.data))
      .catch(()=>setVehicles([]));

    API.get("/packages/")
      .then((res)=>setPackages(res.data))
      .catch(()=>setPackages([]));

  },[]);

  /* PRICE ESTIMATE (the server calculates the final price) */

  const estimate = useMemo(()=>{

    const days = tripDays(pickupDate, returnDate);

    const vehicle = vehicles.find((v)=>String(v.id) === String(vehicleId));

    const pkg = packages.find((p)=>String(p.id) === String(packageId));

    return (vehicle ? vehicle.price_per_day * days : 0) + (pkg ? pkg.price : 0);

  },[vehicles, packages, vehicleId, packageId, pickupDate, returnDate]);

  /* BOOKING */

  async function handleBooking(e){

    e.preventDefault();

    setMessage(null);

    if(!vehicleId && !packageId){

      setMessage({ type:"error", text:"Please choose a vehicle or a tour package." });

      return;

    }

    if(returnDate < pickupDate){

      setMessage({ type:"error", text:"Return date must be on or after the pickup date." });

      return;

    }

    setLoading(true);

    try{

      const res = await API.post(
        "/bookings/create/",
        {

          full_name:fullName,

          email:email,

          phone:phone,

          vehicle:vehicleId || null,

          package:packageId || null,

          pickup_date:pickupDate,

          return_date:returnDate,

          special_request:notes

        }
      );

      setMessage({
        type:"success",
        text:`Booking request sent! Total NPR ${res.data.booking.total_price.toLocaleString()}. We'll email you once it's confirmed.`
      });

      /* RESET */

      setPhone("");
      setVehicleId("");
      setPackageId("");
      setPickupDate("");
      setReturnDate("");
      setNotes("");

    }

    catch(error){

      setMessage({ type:"error", text:getErrorMessage(error, "Booking failed. Please try again.") });

    }

    finally{

      setLoading(false);

    }

  }

  return (

    <>

      <Navbar />

      <section className="booking-page">

        {/* HEADER */}

        <div className="booking-header">

          <p>
            PREMIUM RESERVATION
          </p>

          <h1>
            Book Your Journey
          </h1>

          <span>
            Reserve luxury vehicles,
            premium Nepal tours,
            and unforgettable experiences.
          </span>

        </div>

        {/* CONTAINER */}

        <div className="booking-container">

          {/* LEFT */}

          <div className="booking-left">

            <h2>
              Booking Information
            </h2>

            {message && (

              <div className={`form-message ${message.type}`} role="status">

                {message.text}

                {message.type === "success" && (
                  <> <Link to="/profile">View my bookings</Link></>
                )}

              </div>

            )}

            {/* FORM */}

            <form
              className="booking-form"
              onSubmit={handleBooking}
            >

              {/* NAME */}

              <div className="form-group">

                <label htmlFor="booking-name">
                  Full Name
                </label>

                <input
                  id="booking-name"
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e)=>
                    setFullName(e.target.value)
                  }
                  required
                />

              </div>

              {/* EMAIL + PHONE */}

              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="booking-email">
                    Email Address
                  </label>

                  <input
                    id="booking-email"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e)=>
                      setEmail(e.target.value)
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="booking-phone">
                    Phone Number
                  </label>

                  <input
                    id="booking-phone"
                    type="tel"
                    maxLength={30}
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e)=>
                      setPhone(e.target.value)
                    }
                    required
                  />

                </div>

              </div>

              {/* VEHICLE */}

              <div className="form-group">

                <label htmlFor="booking-vehicle">
                  Vehicle
                </label>

                <select
                  id="booking-vehicle"
                  value={vehicleId}
                  onChange={(e)=>
                    setVehicleId(e.target.value)
                  }
                >

                  <option value="">
                    No vehicle
                  </option>

                  {vehicles.map((v)=>(

                    <option
                      key={v.id}
                      value={v.id}
                      disabled={v.status === "Maintenance"}
                    >
                      {v.brand} {v.name}: NPR {v.price_per_day.toLocaleString()}/day
                      {v.status === "Maintenance" ? " (unavailable)" : ""}
                    </option>

                  ))}

                </select>

              </div>

              {/* PACKAGE */}

              <div className="form-group">

                <label htmlFor="booking-package">
                  Tour Package
                </label>

                <select
                  id="booking-package"
                  value={packageId}
                  onChange={(e)=>
                    setPackageId(e.target.value)
                  }
                >

                  <option value="">
                    No package
                  </option>

                  {packages.map((p)=>(

                    <option key={p.id} value={p.id}>
                      {p.title} ({p.duration}): NPR {p.price.toLocaleString()}
                    </option>

                  ))}

                </select>

              </div>

              {/* DATES */}

              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="booking-pickup">
                    Pickup Date
                  </label>

                  <input
                    id="booking-pickup"
                    type="date"
                    min={today}
                    value={pickupDate}
                    onChange={(e)=>
                      setPickupDate(e.target.value)
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="booking-return">
                    Return Date
                  </label>

                  <input
                    id="booking-return"
                    type="date"
                    min={pickupDate || today}
                    value={returnDate}
                    onChange={(e)=>
                      setReturnDate(e.target.value)
                    }
                    required
                  />

                </div>

              </div>

              {/* NOTES */}

              <div className="form-group">

                <label htmlFor="booking-notes">
                  Special Requests
                </label>

                <textarea
                  id="booking-notes"
                  placeholder="Write additional requests..."
                  value={notes}
                  onChange={(e)=>
                    setNotes(e.target.value)
                  }
                ></textarea>

              </div>

              {estimate > 0 && (

                <p className="booking-estimate">
                  Estimated total: <strong>NPR {estimate.toLocaleString()}</strong>
                </p>

              )}

              {/* BUTTON */}

              <button
                type="submit"
                className="booking-submit-btn"
                disabled={loading}
              >

                {loading
                  ?
                  "Booking..."
                  :
                  "Confirm Booking"
                }

              </button>

            </form>

          </div>

          {/* RIGHT */}

          <div className="booking-right">

            <div className="booking-info-card">

              <h3>
                Why Book With Yatra?
              </h3>

              <ul>

                <li>
                  ✔ Luxury Vehicles
                </li>

                <li>
                  ✔ Professional Drivers
                </li>

                <li>
                  ✔ Premium Nepal Tours
                </li>

                <li>
                  ✔ 24/7 Customer Support
                </li>

                <li>
                  ✔ Safe & Comfortable Travel
                </li>

              </ul>

            </div>

            <div className="booking-image"></div>

          </div>

        </div>

      </section>

      <Footer />

    </>

  );

}

export default Booking;
