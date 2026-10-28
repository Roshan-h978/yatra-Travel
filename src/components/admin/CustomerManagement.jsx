import { useState } from "react";

import API, { getErrorMessage, getStoredUser } from "../../api/api";

import { StatusPill } from "./CrudSection";

import useAdminData from "./useAdminData";

function CustomerManagement() {

  const { data: users, loading, error, reload } = useAdminData("/users/customers/");

  const [search, setSearch] = useState("");

  const [message, setMessage] = useState(null);

  const currentUser = getStoredUser();

  const currentUserId = currentUser?.id;

  // Only a super administrator may change another admin's account (backend enforces this too).
  const canToggle = (u) => u.id !== currentUserId && (!u.is_staff || currentUser?.is_superuser);

  async function toggleActive(user) {

    const action = user.is_active ? "deactivate" : "activate";

    if (!window.confirm(`Are you sure you want to ${action} ${user.email}?`)) return;

    try {

      const res = await API.put(`/users/customers/toggle/${user.id}/`);
      setMessage({ type: "success", text: res.data.message });
      reload();

    } catch (err) {

      setMessage({ type: "error", text: getErrorMessage(err) });

    }

  }

  const term = search.trim().toLowerCase();

  const visible = term
    ? users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(term))
    : users;

  return (

    <section className="admin-section">

      <div className="admin-section-header">

        <div>
          <h2>Customer Management</h2>
          <p>{users.filter((u) => !u.is_staff).length} customers and {users.filter((u) => u.is_staff).length} admins registered.</p>
        </div>

        <div className="admin-field">
          <input
            type="search"
            placeholder="Search name or email..."
            aria-label="Search customers"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      {message && <div className={`admin-alert admin-alert--${message.type}`} role="status">{message.text}</div>}

      <div className="admin-table-wrap">

        <table className="admin-table">

          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Bookings</th>
              <th>Joined</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading && <tr><td className="admin-table-empty" colSpan={7}>Loading customers...</td></tr>}

            {!loading && error && <tr><td className="admin-table-empty" colSpan={7}>{error}</td></tr>}

            {!loading && !error && visible.length === 0 && (
              <tr><td className="admin-table-empty" colSpan={7}>No users found.</td></tr>
            )}

            {!loading && !error && visible.map((u) => (

              <tr key={u.id}>

                <td data-label="User"><div className="admin-cell">
                  <strong>{u.name || u.username}</strong>
                  <span className="admin-muted">{u.email}</span>
                </div></td>

                <td data-label="Role"><div className="admin-cell">{u.is_staff ? "Admin" : "Customer"}</div></td>

                <td data-label="Bookings"><div className="admin-cell">{u.booking_count}</div></td>

                <td data-label="Joined"><div className="admin-cell">{new Date(u.date_joined).toLocaleDateString()}</div></td>

                <td data-label="Last Login"><div className="admin-cell">{u.last_login ? new Date(u.last_login).toLocaleDateString() : "Never"}</div></td>

                <td data-label="Status"><div className="admin-cell"><StatusPill value={u.is_active ? "Active" : "Inactive"} /></div></td>

                <td data-label="Actions"><div className="admin-cell">
                  <button
                    type="button"
                    className={`admin-btn admin-btn--sm ${u.is_active ? "admin-btn--danger" : "admin-btn--success"}`}
                    disabled={!canToggle(u)}
                    title={canToggle(u) ? undefined : "Only a super administrator can change this account"}
                    onClick={() => toggleActive(u)}
                  >
                    {u.is_active ? "Deactivate" : "Activate"}
                  </button>
                </div></td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>

  );

}

export default CustomerManagement;
