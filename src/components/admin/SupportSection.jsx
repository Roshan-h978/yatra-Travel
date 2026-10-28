import { useState } from "react";

import API, { getErrorMessage } from "../../api/api";

import { FiArchive, FiCheckCircle, FiClock, FiCornerUpLeft, FiInbox, FiSend, FiTrash2, FiXCircle } from "react-icons/fi";

import { StatusPill } from "./CrudSection";

import StatCard from "./StatCard";

import useAdminData from "./useAdminData";

function SupportSection() {

  const { data: messages, loading, error, reload } = useAdminData("/support/");

  const [filter, setFilter] = useState("Pending");

  const [replyingId, setReplyingId] = useState(null);

  const [replyText, setReplyText] = useState("");

  const [sending, setSending] = useState(false);

  const [notice, setNotice] = useState(null);

  function startReply(msg) {

    setReplyingId(msg.id);
    setReplyText(msg.admin_reply || "");

  }

  async function sendReply(id) {

    setSending(true);
    setNotice(null);

    try {

      await API.put(`/support/reply/${id}/`, { admin_reply: replyText });
      setNotice({ type: "success", text: "Reply sent to the customer by email." });
      setReplyingId(null);
      reload();

    } catch (err) {

      setNotice({ type: "error", text: getErrorMessage(err) });

    } finally {

      setSending(false);

    }

  }

  async function runAction(request, successText) {

    try {

      await request;
      setNotice({ type: "success", text: successText });
      reload();

    } catch (err) {

      setNotice({ type: "error", text: getErrorMessage(err) });

    }

  }

  function closeMessage(id) {

    runAction(API.put(`/support/close/${id}/`), "Conversation closed.");

  }

  function deleteMessage(id) {

    if (!window.confirm("Delete this message?")) return;

    runAction(API.delete(`/support/delete/${id}/`), "Message deleted.");

  }

  const count = (status) => messages.filter((m) => m.status === status).length;

  const visible = filter === "All" ? messages : messages.filter((m) => m.status === filter);

  return (

    <section className="admin-section">

      <div className="admin-section-header">

        <div>
          <h2>Customer Support</h2>
          <p>Messages sent from the website contact form.</p>
        </div>

      </div>

      <div className="admin-stats-grid">

        <StatCard icon={FiClock} tone="amber" label="Pending" value={count("Pending")} />

        <StatCard icon={FiCheckCircle} tone="blue" label="Replied" value={count("Replied")} />

        <StatCard icon={FiArchive} tone="green" label="Closed" value={count("Closed")} />

        <StatCard icon={FiInbox} label="Total" value={messages.length} />

      </div>

      {notice && <div className={`admin-alert admin-alert--${notice.type}`} role="status">{notice.text}</div>}

      <div className="admin-card">

        <div className="admin-filter-row">
          {["Pending", "Replied", "Closed", "All"].map((s) => (
            <button
              key={s}
              type="button"
              className={`admin-btn admin-btn--sm ${filter === s ? "admin-btn--dark" : "admin-btn--ghost"}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {loading && <p className="admin-loading-text">Loading messages...</p>}

        {!loading && error && <div className="admin-alert admin-alert--error">{error}</div>}

        {!loading && !error && visible.length === 0 && (
          <p className="admin-loading-text">No {filter === "All" ? "" : filter.toLowerCase() + " "}messages.</p>
        )}

        <div className="admin-list">

          {!loading && !error && visible.map((m) => (

            <div className="admin-list-item" key={m.id}>

              <div className="admin-list-body">

                <h4>{m.subject} <StatusPill value={m.status} /></h4>

                <p>{m.customer_name} · {m.email} · {new Date(m.created_at).toLocaleString()}</p>

                <p className="admin-message">{m.message}</p>

                {m.admin_reply && replyingId !== m.id && (
                  <div className="admin-quote"><strong>Your reply:</strong> {m.admin_reply}</div>
                )}

                {replyingId === m.id && (

                  <div className="admin-reply-box">

                    <textarea
                      aria-label="Reply"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                    />

                    <div className="admin-actions">
                      <button type="button" className="admin-btn admin-btn--primary admin-btn--sm"
                        disabled={sending || !replyText.trim()} onClick={() => sendReply(m.id)}>
                        <FiSend aria-hidden="true" /> {sending ? "Sending..." : "Send Reply"}
                      </button>
                      <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setReplyingId(null)}>
                        Cancel
                      </button>
                    </div>

                  </div>

                )}

              </div>

              <div className="admin-actions">

                {replyingId !== m.id && (
                  <button type="button" className="admin-btn admin-btn--dark admin-btn--sm" onClick={() => startReply(m)}>
                    <FiCornerUpLeft aria-hidden="true" /> {m.admin_reply ? "Edit Reply" : "Reply"}
                  </button>
                )}

                {m.status !== "Closed" && (
                  <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => closeMessage(m.id)}><FiXCircle aria-hidden="true" /> Close</button>
                )}

                <button type="button" className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => deleteMessage(m.id)}><FiTrash2 aria-hidden="true" /> Delete</button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}

export default SupportSection;
