import { useEffect,useState }

from "react";

import API from "../api/api";

import Navbar
from "../components/Navbar/Navbar";

import Footer
from "../components/Footer/Footer";

import "./ProfileHome.css";

function ProfileHome() {

  const [bookings,setBookings] =
  useState([]);

  const [loading,setLoading] =
  useState(true);

  const userEmail =
  localStorage.getItem(
    "userEmail"
  );

  /* FETCH BOOKINGS */

  useEffect(()=>{

    fetchBookings();

  },[]);

  async function fetchBookings(){

    try{

      const response =
      await API.get(
        "/bookings/"
      );

      setBookings(
        response.data
      );

    }

    catch(error){

      console.log(error);

    }

    finally{

      setLoading(false);

    }

  }

  return (

    <>

      <Navbar />

      <section className="profile-page">

        {/* TOP */}

        <div className="profile-top">

          <div className="profile-avatar">

            Y

          </div>

          <div className="profile-info">

            <p>
              WELCOME BACK
            </p>

            <h1>
              Your Yatra Dashboard
            </h1>

            <span>
              Manage bookings, explore
              premium tours, and enjoy
              luxury Nepal travel.
            </span>

          </div>

        </div>

        {/* STATS */}

        <div className="profile-stats">

          <div className="profile-stat-card">

            <h2>

              {bookings.length}

            </h2>

            <p>
              Total Bookings
            </p>

          </div>

          <div className="profile-stat-card">

            <h2>
              5+
            </h2>

            <p>
              Destinations
            </p>

          </div>

          <div className="profile-stat-card">

            <h2>
              Premium
            </h2>

            <p>
              Membership
            </p>

          </div>

        </div>

        {/* BOOKINGS */}

        <div className="profile-bookings">

          <div className="profile-section-header">

            <h2>
              Recent Bookings
            </h2>

          </div>

          {loading && (

            <h3>
              Loading Bookings...
            </h3>

          )}

          {!loading && bookings.length === 0 && (

            <p>
              No bookings found.
            </p>

          )}

          <div className="booking-history-grid">

            {bookings.map((booking)=>(

              <div
                className="history-card"
                key={booking.id}
              >

                <h3>

                  {booking.destination}

                </h3>

                <p>

                  Vehicle:
                  {" "}
                  {booking.vehicle_name}

                </p>

                <p>

                  Pickup:
                  {" "}
                  {booking.pickup_date}

                </p>

                <p>

                  Return:
                  {" "}
                  {booking.return_date}

                </p>

                <div className="booking-status">

                  Pending

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      <Footer />

    </>

  );

}

export default ProfileHome;