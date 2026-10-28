import { useState } from "react";

import API, { getErrorMessage } from "../../api/api";

import { FiEye, FiEyeOff, FiTrash2 } from "react-icons/fi";

import { StatusPill } from "./CrudSection";

import useAdminData from "./useAdminData";

function ReviewManagement() {

  const { data: reviews, loading, error, reload } = useAdminData("/support/reviews/all/");

  const [message, setMessage] = useState(null);

  async function setApproved(review, isApproved) {

    try {

      await API.put(`/support/reviews/update/${review.id}/`, { is_approved: isApproved });
      setMessage({ type: "success", text: isApproved ? "Review published." : "Review hidden." });
      reload();

    } catch (err) {

      setMessage({ type: "error", text: getErrorMessage(err) });

    }

  }

  async function deleteReview(review) {

    if (!window.confirm("Delete this review?")) return;

    try {

      await API.delete(`/support/reviews/delete/${review.id}/`);
      setMessage({ type: "success", text: "Review deleted." });
      reload();

    } catch (err) {

      setMessage({ type: "error", text: getErrorMessage(err) });

    }

  }

  const pending = reviews.filter((r) => !r.is_approved).length;

  return (

    <section className="admin-section">

      <div className="admin-section-header">

        <div>
          <h2>Review Management</h2>
          <p>Customers submit reviews from their profile. Only published reviews are public. {pending} waiting for approval.</p>
        </div>

      </div>

      {message && <div className={`admin-alert admin-alert--${message.type}`} role="status">{message.text}</div>}

      <div className="admin-table-wrap">

        <table className="admin-table">

          <thead>
            <tr>
              <th>Customer</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading && <tr><td className="admin-table-empty" colSpan={6}>Loading reviews...</td></tr>}

            {!loading && error && <tr><td className="admin-table-empty" colSpan={6}>{error}</td></tr>}

            {!loading && !error && reviews.length === 0 && (
              <tr><td className="admin-table-empty" colSpan={6}>No reviews yet.</td></tr>
            )}

            {!loading && !error && reviews.map((r) => (

              <tr key={r.id}>

                <td data-label="Customer"><div className="admin-cell"><strong>{r.user_name}</strong></div></td>

                <td data-label="Rating"><div className="admin-cell">{"★".repeat(r.rating)}</div></td>

                <td data-label="Review" className="admin-cell-wide"><div className="admin-cell">{r.comment}</div></td>

                <td data-label="Date"><div className="admin-cell">{new Date(r.created_at).toLocaleDateString()}</div></td>

                <td data-label="Status"><div className="admin-cell"><StatusPill value={r.is_approved ? "Published" : "Hidden"} /></div></td>

                <td data-label="Actions"><div className="admin-cell">
                  <div className="admin-actions">
                    {r.is_approved ? (
                      <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setApproved(r, false)}><FiEyeOff aria-hidden="true" /> Hide</button>
                    ) : (
                      <button type="button" className="admin-btn admin-btn--success admin-btn--sm" onClick={() => setApproved(r, true)}><FiEye aria-hidden="true" /> Publish</button>
                    )}
                    <button type="button" className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => deleteReview(r)}><FiTrash2 aria-hidden="true" /> Delete</button>
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

export default ReviewManagement;
