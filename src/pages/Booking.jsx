import { useState } from "react";

import API from "../api/api";

import Navbar from "../components/Navbar/Navbar";

import Footer from "../components/Footer/Footer";

import "./Booking.css";

function Booking() {

  /* STATES */

  const [fullName,setFullName] =
  useState("");

  const [email,setEmail] =
  useState("");

  const [phone,setPhone] =
  useState("");

  const [destination,setDestination] =
  useState("");

  const [vehicle,setVehicle] =
  useState("");

  const [pickupDate,setPickupDate] =
  useState("");

  const [returnDate,setReturnDate] =
  useState("");

  const [notes,setNotes] =
  useState("");

  const [loading,setLoading] =
  useState(false);

  /* BOOKING */

  async function handleBooking(e){

    e.preventDefault();

    setLoading(true);

    try{

      await API.post(
        "/bookings/add/",
        {

          customer_name:fullName,

          email:email,

          phone:phone,

          destination:destination,

          vehicle_name:vehicle,

          pickup_date:pickupDate,

          return_date:returnDate,

          additional_notes:notes

        }
      );

      alert(
        "Booking Created Successfully"
      );

      /* RESET */

      setFullName("");
      setEmail("");
      setPhone("");
      setDestination("");
      setVehicle("");
      setPickupDate("");
      setReturnDate("");
      setNotes("");

    }

    catch(error){

      alert(
        "Booking Failed"
      );

      console.log(error);

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

            {/* FORM */}

            <form
              className="booking-form"
              onSubmit={handleBooking}
            >

              {/* NAME */}

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e)=>
                    setFullName(e.target.value)
                  }
                  required
                />

              </div>

              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e)=>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

              {/* PHONE */}

              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e)=>
                    setPhone(e.target.value)
                  }
                  required
                />

              </div>

              {/* DESTINATION */}

              <div className="form-group">

                <label>
                  Destination
                </label>

                <select
                  value={destination}
                  onChange={(e)=>
                    setDestination(e.target.value)
                  }
                  required
                >

                  <option value="">
                    Select Destination
                  </option>

                  <option>
                    Kathmandu
                  </option>

                  <option>
                    Pokhara
                  </option>

                  <option>
                    Mustang
                  </option>

                  <option>
                    Chitwan
                  </option>

                  <option>
                    Everest Region
                  </option>

                </select>

              </div>

              {/* DATES */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Pickup Date
                  </label>

                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e)=>
                      setPickupDate(e.target.value)
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Return Date
                  </label>

                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e)=>
                      setReturnDate(e.target.value)
                    }
                    required
                  />

                </div>

              </div>

              {/* VEHICLE */}

              <div className="form-group">

                <label>
                  Vehicle
                </label>

                <select
                  value={vehicle}
                  onChange={(e)=>
                    setVehicle(e.target.value)
                  }
                  required
                >

                  <option value="">
                    Select Vehicle
                  </option>

                  <option>
                    Toyota Prado
                  </option>

                  <option>
                    Ford Everest
                  </option>

                  <option>
                    Scorpio N
                  </option>

                  <option>
                    Suzuki Jimny
                  </option>

                  <option>
                    Land Cruiser
                  </option>

                </select>

              </div>

              {/* NOTES */}

              <div className="form-group">

                <label>
                  Additional Notes
                </label>

                <textarea
                  placeholder="Write additional requests..."
                  value={notes}
                  onChange={(e)=>
                    setNotes(e.target.value)
                  }
                ></textarea>

              </div>

              {/* BUTTON */}

              <button
                type="submit"
                className="booking-submit-btn"
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

            <div className="booking-card">

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