import { FiCalendar, FiDollarSign, FiPercent, FiRefreshCw, FiUsers } from "react-icons/fi";

import StatCard from "./StatCard";

import useAdminData from "./useAdminData";

const STATUS_ROWS = [
  { key: "pending_bookings", label: "Pending", color: "#F59E0B" },
  { key: "approved_bookings", label: "Approved", color: "#3B82F6" },
  { key: "completed_bookings", label: "Completed", color: "#10B981" },
  { key: "rejected_bookings", label: "Rejected", color: "#EF4444" },
  { key: "cancelled_bookings", label: "Cancelled", color: "#94A3B8" },
];

function AnalyticsSection() {

  const { data: stats, loading, error, reload } = useAdminData("/support/analytics/", null);

  if (loading) return <p className="admin-loading-text">Loading analytics...</p>;

  if (error || !stats) {

    return (
      <div className="admin-alert admin-alert--error">
        {error || "Could not load analytics."}{" "}
        <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={reload}>Retry</button>
      </div>
    );

  }

  const totalBookings = stats.total_bookings || 0;

  const confirmed = stats.approved_bookings + stats.completed_bookings;

  const conversion = totalBookings ? Math.round((confirmed / totalBookings) * 100) : 0;

  const fleetUse = stats.total_vehicles
    ? Math.round(((stats.total_vehicles - stats.available_vehicles) / stats.total_vehicles) * 100)
    : 0;

  return (

    <section className="admin-section">

      <div className="admin-section-header">

        <div>
          <h2>Analytics</h2>
          <p>Revenue counts approved and completed bookings only.</p>
        </div>

        <button type="button" className="admin-btn admin-btn--ghost" onClick={reload}><FiRefreshCw aria-hidden="true" /> Refresh</button>

      </div>

      <div className="admin-stats-grid">

        <StatCard icon={FiDollarSign} tone="green" label="Total Revenue" value={`NPR ${stats.total_revenue.toLocaleString()}`} />

        <StatCard icon={FiCalendar} tone="blue" label="Total Bookings" value={totalBookings} />

        <StatCard icon={FiUsers} tone="purple" label="Customers" value={stats.total_customers} />

        <StatCard icon={FiPercent} tone="amber" label="Confirmation Rate" value={`${conversion}%`} />

      </div>

      <div className="admin-grid-2">

        <div className="admin-card">

          <h3>Bookings by Status</h3>

          {STATUS_ROWS.map((row) => {

            const value = stats[row.key];

            const pct = totalBookings ? (value / totalBookings) * 100 : 0;

            return (
              <div className="admin-bar-row" key={row.key}>
                <span>{row.label}</span>
                <div className="admin-bar-track">
                  <div className="admin-bar-fill" style={{ width: `${pct}%`, background: row.color }} />
                </div>
                <strong>{value}</strong>
              </div>
            );

          })}

        </div>

        <div className="admin-card">

          <h3>Inventory</h3>

          <div className="admin-bar-row">
            <span>Fleet in use</span>
            <div className="admin-bar-track"><div className="admin-bar-fill" style={{ width: `${fleetUse}%` }} /></div>
            <strong>{fleetUse}%</strong>
          </div>

          <div className="admin-list">
            <div className="admin-list-item"><h4>Vehicles</h4><span>{stats.total_vehicles} ({stats.available_vehicles} available)</span></div>
            <div className="admin-list-item"><h4>Tour Packages</h4><span>{stats.total_packages}</span></div>
            <div className="admin-list-item"><h4>Drivers</h4><span>{stats.total_drivers}</span></div>
            <div className="admin-list-item"><h4>Open Support Messages</h4><span>{stats.pending_support}</span></div>
          </div>

        </div>

      </div>

    </section>

  );

}

export default AnalyticsSection;
