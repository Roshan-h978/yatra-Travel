import { useState } from "react";

import API, { getErrorMessage } from "../../api/api";

import { FiCheck, FiFlag, FiMap, FiRotateCcw, FiSlash, FiTrash2, FiTruck, FiX } from "react-icons/fi";

import { StatusPill } from "./CrudSection";

import useAdminData from "./useAdminData";

const STATUSES = ["Pending", "Approved", "Rejected", "Completed", "Cancelled"];

function BookingManagement() {

  const { data: bookings, loading, error, reload } = useAdminData("/bookings/");

  const { data: drivers } = useAdminData("/drivers/");

  const [filter, setFilter] = useState("All");

  const [message, setMessage] = useState(null);

  const [busyId, setBusyId] = useState(null);

  async function updateBooking(id, changes, successText) {

    setBusyId(id);
    setMessage(null);

    try {

      await API.put(`/bookings/update/${id}/`, changes);
      setMessage({ type: "success", text: successText });
      reload();

    } catch (err) {

      setMessage({ type: "error", text: getErrorMessage(err, "Update failed.") });

    } finally {

      setBusyId(null);

    }

  }

  async function deleteBooking(id) {

    if (!window.confirm("Delete this booking? This cannot be undone.")) return;

    try {

      await API.delete(`/bookings/delete/${id}/`);
      setMessage({ type: "success", text: "Booking deleted." });
      reload();

    } catch (err) {

      setMessage({ type: "error", text: getErrorMessage(err, "Delete failed.") });

    }

  }

  const visible = filter === "All" ? bookings : bookings.filter((b) => b.status === filter);

  return (

    <section className="admin-section">

      <div className="admin-section-header">

        <div>
          <h2>Booking Management</h2>
          <p>Approve requests, assign drivers and track trips. Customers are emailed on every status change.</p>
        </div>

        <div className="admin-filter-row">
          {["All", ...STATUSES].map((s) => (
            <button
              key={s}
              type="button"
              className={`admin-btn admin-btn--sm ${filter === s ? "admin-btn--dark" : "admin-btn--ghost"}`}
              onClick={() => setFilter(s)}
            >
              {s}{s !== "All" ? ` (${bookings.filter((b) => b.status === s).length})` : ""}
            </button>
          ))}
        </div>

      </div>

      {message && <div className={`admin-alert admin-alert--${message.type}`} role="status">{message.text}</div>}

      <div className="admin-table-wrap">

        <table className="admin-table">

          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Booking</th>
              <th>Dates</th>
              <th>Total</th>
              <th>Status</th>
              <th>Driver</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading && <tr><td className="admin-table-empty" colSpan={8}>Loading bookings...</td></tr>}

            {!loading && error && <tr><td className="admin-table-empty" colSpan={8}>{error}</td></tr>}

            {!loading && !error && visible.length === 0 && (
              <tr><td className="admin-table-empty" colSpan={8}>No bookings found.</td></tr>
            )}

            {!loading && !error && visible.map((b) => (

              <tr key={b.id}>

                <td data-label="#"><div className="admin-cell">{b.id}</div></td>

                <td data-label="Customer"><div className="admin-cell">
                  <strong>{b.full_name}</strong>
                  <span className="admin-muted">{b.email}</span>
                  <span className="admin-muted">{b.phone}</span>
                </div></td>

                <td data-label="Booking"><div className="admin-cell">
                  {b.vehicle_name && <span className="admin-inline-icon"><FiTruck aria-hidden="true" /> {b.vehicle_name}</span>}
                  {b.package_title && <span className={b.vehicle_name ? "admin-muted" : ""}><FiMap aria-hidden="true" /> {b.package_title}</span>}
                  {b.special_request && <span className="admin-muted" title={b.special_request}>“{b.special_request.slice(0, 40)}{b.special_request.length > 40 ? "…" : ""}”</span>}
                </div></td>

                <td data-label="Dates"><div className="admin-cell">
                  {b.pickup_date}
                  <span className="admin-muted">to {b.return_date}</span>
                </div></td>

                <td data-label="Total"><div className="admin-cell">NPR {b.total_price.toLocaleString()}</div></td>

                <td data-label="Status"><div className="admin-cell"><StatusPill value={b.status} /></div></td>

                <td data-label="Driver"><div className="admin-cell">
                  <select
                    aria-label="Assign driver"
                    value={b.driver || ""}
                    disabled={busyId === b.id}
                    onChange={(e) => updateBooking(b.id, { driver: e.target.value || null }, "Driver updated.")}
                  >
                    <option value="">Unassigned</option>
                    {b.driver && !drivers.some((d) => d.id === b.driver) && (
                      <option value={b.driver}>{b.driver_name}</option>
                    )}
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>{d.full_name} ({d.status})</option>
                    ))}
                  </select>
                </div></td>

                <td data-label="Actions"><div className="admin-cell">
                  <div className="admin-actions">

                    {b.status === "Pending" && (
                      <>
                        <button type="button" className="admin-btn admin-btn--success admin-btn--sm" disabled={busyId === b.id}
                          onClick={() => updateBooking(b.id, { status: "Approved" }, "Booking approved.")}>
                          <FiCheck aria-hidden="true" /> Approve
                        </button>
                        <button type="button" className="admin-btn admin-btn--danger admin-btn--sm" disabled={busyId === b.id}
                          onClick={() => updateBooking(b.id, { status: "Rejected" }, "Booking rejected.")}>
                          <FiX aria-hidden="true" /> Reject
                        </button>
                      </>
                    )}

                    {b.status === "Approved" && (
                      <>
                        <button type="button" className="admin-btn admin-btn--dark admin-btn--sm" disabled={busyId === b.id}
                          onClick={() => updateBooking(b.id, { status: "Completed" }, "Booking marked completed.")}>
                          <FiFlag aria-hidden="true" /> Complete
                        </button>
                        <button type="button" className="admin-btn admin-btn--danger admin-btn--sm" disabled={busyId === b.id}
                          onClick={() => window.confirm("Cancel this approved booking? The customer will be emailed.") &&
                            updateBooking(b.id, { status: "Rejected" }, "Booking cancelled.")}>
                          <FiSlash aria-hidden="true" /> Cancel
                        </button>
                      </>
                    )}

                    {b.status === "Rejected" && (
                      <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" disabled={busyId === b.id}
                        onClick={() => updateBooking(b.id, { status: "Pending" }, "Booking reopened.")}>
                        <FiRotateCcw aria-hidden="true" /> Reopen
                      </button>
                    )}

                    <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => deleteBooking(b.id)}>
                      <FiTrash2 aria-hidden="true" /> Delete
                    </button>

                  </div>
                </div></td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>

  );

}

export default BookingManagement;
