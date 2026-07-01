import {

  useEffect,

  useState

}

from "react";

import API from "../../api/api";

import "./AnalyticsSection.css";

function AnalyticsSection(){

  const [analytics,setAnalytics] =
  useState(null);

  async function fetchAnalytics(){
    try{
      const response = await API.get("/support/analytics/");
      setAnalytics(response.data);
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(()=>{
    fetchAnalytics();
  },[]);

  if(!analytics){

    return <p>Loading Analytics...</p>;

  }

  return(

    <section className="dashboard-section">

      <div className="section-header">

        <h2>

          Analytics Dashboard

        </h2>

      </div>

      <div className="stats-grid">

        <div className="stat-card">

          <h2>

            {analytics.total_bookings}

          </h2>

          <p>Total Bookings</p>

        </div>

        <div className="stat-card">

          <h2>

            {analytics.total_vehicles}

          </h2>

          <p>Total Vehicles</p>

        </div>

        <div className="stat-card">

          <h2>

            {analytics.total_packages}

          </h2>

          <p>Total Packages</p>

        </div>

        <div className="stat-card">

          <h2>

            {analytics.total_customers}

          </h2>

          <p>Total Customers</p>

        </div>

        <div className="stat-card">

          <h2>

            NPR {analytics.total_revenue}

          </h2>

          <p>Total Revenue</p>

        </div>

        <div className="stat-card">

          <h2>

            {analytics.approved_bookings}

          </h2>

          <p>Approved Bookings</p>

        </div>

        <div className="stat-card">

          <h2>

            {analytics.pending_bookings}

          </h2>

          <p>Pending Bookings</p>

        </div>

        <div className="stat-card">

          <h2>

            {analytics.completed_bookings}

          </h2>

          <p>Completed Bookings</p>

        </div>

      </div>

    </section>

  );

}

export default AnalyticsSection;