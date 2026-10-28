import { FiCalendar, FiClock, FiDollarSign, FiMap, FiTruck, FiUsers, FiArrowRight, FiCornerUpLeft } from "react-icons/fi";

import { StatusPill } from "./CrudSection";

import StatCard from "./StatCard";

import useAdminData from "./useAdminData";

function DashboardOverview({ onNavigate }) {

  const { data: stats, loading, error } = useAdminData("/support/analytics/", null);

  const { data: bookings, loading: bookingsLoading, error: bookingsError } = useAdminData("/bookings/");

  const { data: messages, loading: messagesLoading, error: messagesError } = useAdminData("/support/");

  const recentBookings = bookings.slice(0, 5);

  const openMessages = messages.filter((m) => m.status === "Pending").slice(0, 5);

  return (

    <section className="admin-section">

      <div className="admin-section-header">

        <div>
          <h2>Dashboard Overview</h2>
          <p>Live summary of bookings, fleet and customer activity.</p>
        </div>

        <button type="button" className="admin-btn admin-btn--primary" onClick={() => onNavigate("bookings")}>
          Manage Bookings <FiArrowRight aria-hidden="true" />
        </button>

      </div>

      {loading && <p className="admin-loading-text">Loading summary...</p>}

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      {stats && (

        <div className="admin-stats-grid">

          <StatCard icon={FiCalendar} tone="blue" label="Total Bookings" value={stats.total_bookings} />

          <StatCard icon={FiClock} tone="amber" label="Pending Approval" value={stats.pending_bookings} />

          <StatCard icon={FiDollarSign} tone="green" label="Revenue" value={`NPR ${stats.total_revenue.toLocaleString()}`} />

          <StatCard icon={FiUsers} tone="purple" label="Customers" value={stats.total_customers} />

          <StatCard icon={FiTruck} label="Vehicles Available" value={`${stats.available_vehicles} / ${stats.total_vehicles}`} />

          <StatCard icon={FiMap} tone="blue" label="Tour Packages" value={stats.total_packages} />

        </div>

      )}

      <div className="admin-grid-2">

        <div className="admin-card">

          <h3>Recent Bookings</h3>

          {bookingsLoading && <p className="admin-loading-text">Loading...</p>}

          {bookingsError && <div className="admin-alert admin-alert--error">{bookingsError}</div>}

          {!bookingsLoading && !bookingsError && recentBookings.length === 0 && <p className="admin-loading-text">No bookings yet.</p>}

          <div className="admin-list">

            {recentBookings.map((b) => (

              <div className="admin-list-item" key={b.id}>

                <div>
                  <h4>{b.full_name}</h4>
                  <p>{b.vehicle_name || b.package_title} · {b.pickup_date} → {b.return_date}</p>
                </div>

                <StatusPill value={b.status} />

              </div>

            ))}

          </div>

        </div>

        <div className="admin-card">

          <h3>Support Messages Awaiting Reply</h3>

          {messagesLoading && <p className="admin-loading-text">Loading...</p>}

          {messagesError && <div className="admin-alert admin-alert--error">{messagesError}</div>}

          {!messagesLoading && !messagesError && openMessages.length === 0 && <p className="admin-loading-text">All caught up.</p>}

          <div className="admin-list">

            {openMessages.map((m) => (

              <div className="admin-list-item" key={m.id}>

                <div>
                  <h4>{m.subject}</h4>
                  <p>{m.customer_name} · {new Date(m.created_at).toLocaleDateString()}</p>
                </div>

                <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => onNavigate("support")}>
                  <FiCornerUpLeft aria-hidden="true" /> Reply
                </button>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>

  );

}

export default DashboardOverview;
