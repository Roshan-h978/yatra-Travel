import "./DashboardOverview.css";

function DashboardOverview(){

  return (

    <div className="dashboard-overview">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <h1>

            Dashboard Overview

          </h1>

          <p>

            Welcome back to the Yatra Admin Panel

          </p>

        </div>

        <button className="dashboard-btn">

          Generate Report

        </button>

      </div>

      {/* STATS */}

      <div className="stats-grid">

        {/* BOOKINGS */}

        <div className="stat-card bookings">

          <div className="stat-top">

            <span className="stat-icon">

              📅

            </span>

            <span className="growth positive">

              +12%

            </span>

          </div>

          <h2>

            1,245

          </h2>

          <p>

            Total Bookings

          </p>

        </div>

        {/* VEHICLES */}

        <div className="stat-card vehicles">

          <div className="stat-top">

            <span className="stat-icon">

              🚘

            </span>

            <span className="growth positive">

              +8%

            </span>

          </div>

          <h2>

            120

          </h2>

          <p>

            Luxury Vehicles

          </p>

        </div>

        {/* PACKAGES */}

        <div className="stat-card packages">

          <div className="stat-top">

            <span className="stat-icon">

              🌍

            </span>

            <span className="growth positive">

              +5%

            </span>

          </div>

          <h2>

            48

          </h2>

          <p>

            Tour Packages

          </p>

        </div>

        {/* REVENUE */}

        <div className="stat-card revenue">

          <div className="stat-top">

            <span className="stat-icon">

              💰

            </span>

            <span className="growth positive">

              +21%

            </span>

          </div>

          <h2>

            NPR 12.5L

          </h2>

          <p>

            Monthly Revenue

          </p>

        </div>

      </div>

      {/* LOWER SECTION */}

      <div className="dashboard-lower">

        {/* RECENT ACTIVITY */}

        <div className="dashboard-card activity-card">

          <div className="card-header">

            <h3>

              Recent Activity

            </h3>

          </div>

          <div className="activity-list">

            <div className="activity-item">

              <div className="activity-dot green"></div>

              <div>

                <h4>

                  New Booking Confirmed

                </h4>

                <p>

                  Toyota Prado booked for Pokhara Tour

                </p>

              </div>

            </div>

            <div className="activity-item">

              <div className="activity-dot blue"></div>

              <div>

                <h4>

                  New Customer Registered

                </h4>

                <p>

                  Alex Johnson created a new account

                </p>

              </div>

            </div>

            <div className="activity-item">

              <div className="activity-dot red"></div>

              <div>

                <h4>

                  Booking Cancelled

                </h4>

                <p>

                  Mustang tour booking was cancelled

                </p>

              </div>

            </div>

          </div>

        </div>

        {/* QUICK STATS */}

        <div className="dashboard-card quick-card">

          <div className="card-header">

            <h3>

              Quick Stats

            </h3>

          </div>

          <div className="quick-stats">

            <div className="quick-stat">

              <span>

                Pending Approvals

              </span>

              <h4>

                18

              </h4>

            </div>

            <div className="quick-stat">

              <span>

                Active Drivers

              </span>

              <h4>

                36

              </h4>

            </div>

            <div className="quick-stat">

              <span>

                Customer Reviews

              </span>

              <h4>

                324

              </h4>

            </div>

            <div className="quick-stat">

              <span>

                Support Tickets

              </span>

              <h4>

                7

              </h4>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default DashboardOverview;