import { useEffect, useState } from "react";

import API from "../../api/api";

function BookingManagement(){

  const [bookings,setBookings] =
  useState([]);

  useEffect(()=>{

    fetchBookings();

  },[]);

  async function fetchBookings(){

    try{

      const response =
      await API.get("/bookings/");

      setBookings(response.data);

    }

    catch(error){

      console.log(error);

    }

  }

  async function updateStatus(id,status){

    try{

      await API.put(

        `/bookings/update/${id}/`,

        {

          status

        }

      );

      fetchBookings();

    }

    catch(error){

      console.log(error);

    }

  }

  async function deleteBooking(id){

    try{

      await API.delete(

        `/bookings/delete/${id}/`

      );

      fetchBookings();

    }

    catch(error){

      console.log(error);

    }

  }

  return(

    <section className="dashboard-section">

      <div className="section-header">

        <h2>

          Booking Management

        </h2>

      </div>

      <table>

        <thead>

          <tr>

            <th>Customer</th>

            <th>Email</th>

            <th>Status</th>

            <th>Pickup</th>

            <th>Return</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {

            bookings.map((booking)=>(

              <tr key={booking.id}>

                <td>

                  {booking.full_name}

                </td>

                <td>

                  {booking.email}

                </td>

                <td>

                  {booking.status}

                </td>

                <td>

                  {booking.pickup_date}

                </td>

                <td>

                  {booking.return_date}

                </td>

                <td>

                  <button
                    onClick={()=>updateStatus(

                      booking.id,

                      "Approved"

                    )}
                  >
                    Approve
                  </button>

                  <button
                    onClick={()=>updateStatus(

                      booking.id,

                      "Rejected"

                    )}
                  >
                    Reject
                  </button>

                  <button
                    onClick={()=>deleteBooking(

                      booking.id

                    )}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          }

        </tbody>

      </table>

    </section>

  );

}

export default BookingManagement;