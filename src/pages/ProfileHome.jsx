import { useEffect, useMemo, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import {
  FiAlertCircle,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCompass,
  FiEdit3,
  FiGrid,
  FiHeadphones,
  FiLock,
  FiLogOut,
  FiMap,
  FiStar,
  FiTruck,
  FiUser,
  FiXCircle,
} from "react-icons/fi";

import API, { getErrorMessage, getStoredUser } from "../api/api";

import Navbar from "../components/Navbar/Navbar";

import Footer from "../components/Footer/Footer";

import PasswordInput from "../components/PasswordInput/PasswordInput";

import useLogout from "../hooks/useLogout";

import { daysBetween, formatDate, localToday } from "../utils/dates";

import "./ProfileHome.css";

/* =========================
   HELPERS
========================= */

const TABS = [
  { id: "overview", label: "Overview", icon: FiGrid },
  { id: "trips", label: "My Trips", icon: FiCalendar },
  { id: "reviews", label: "Reviews", icon: FiStar },
  { id: "account", label: "Account", icon: FiUser },
  { id: "security", label: "Security", icon: FiLock },
];

function tripTitle(b) {

  return b.package_title || b.vehicle_name || `Booking #${b.id}`;

}

// Upcoming = still active and not over; Past = finished; Cancelled = cancelled or declined.
function tripGroup(b, today) {

  if (b.status === "Cancelled" || b.status === "Rejected") return "cancelled";

  if (b.status === "Completed" || b.return_date < today) return "past";

  return "upcoming";

}

function canCancel(b, today) {

  return ["Pending", "Approved"].includes(b.status) && b.pickup_date > today;

}

const STATUS_LABEL = { Rejected: "Declined", Approved: "Confirmed" };

function StatusBadge({ status }) {

  return (
    <span className={`pf-status pf-status--${status.toLowerCase()}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );

}

function passwordStrength(pw) {

  let score = 0;

  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (!pw) return { level: 0, label: "" };
  if (score <= 2) return { level: 1, label: "Weak" };
  if (score <= 3) return { level: 2, label: "Fair" };
  if (score === 4) return { level: 3, label: "Good" };

  return { level: 4, label: "Strong" };

}

/* =========================
   PAGE
========================= */

function ProfileHome() {

  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = TABS.some((t) => t.id === searchParams.get("tab"))
    ? searchParams.get("tab")
    : "overview";

  const today = localToday();

  const [user, setUser] = useState(getStoredUser());

  const [bookings, setBookings] = useState([]);

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  /* LOAD EVERYTHING ONCE */

  useEffect(() => {

    Promise.all([
      API.get("/users/me/"),
      API.get("/bookings/my/"),
      API.get("/support/reviews/my/"),
    ])
      .then(([me, myBookings, myReviews]) => {
        setUser(me.data);
        setBookings(myBookings.data);
        setReviews(myReviews.data);
      })
      .catch((err) => setLoadError(getErrorMessage(err, "Could not load your profile.")))
      .finally(() => setLoading(false));

  }, []);

  function openTab(id) {

    setSearchParams(id === "overview" ? {} : { tab: id });

  }

  /* DERIVED DATA */

  const groups = useMemo(() => {

    const g = { upcoming: [], past: [], cancelled: [] };

    bookings.forEach((b) => g[tripGroup(b, today)].push(b));

    g.upcoming.sort((a, b) => a.pickup_date.localeCompare(b.pickup_date));

    return g;

  }, [bookings, today]);

  const totalSpent = bookings
    .filter((b) => ["Approved", "Completed"].includes(b.status))
    .reduce((sum, b) => sum + b.total_price, 0);

  const displayName = user?.name || user?.email || "Traveler";

  const memberSince = user?.date_joined
    ? new Date(user.date_joined).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : null;

  function replaceBooking(updated) {

    setBookings((list) => list.map((b) => (b.id === updated.id ? updated : b)));

  }

  const logout = useLogout();

  return (

    <>

      <Navbar />

      <section className="profile-page">

        {/* =========================
            IDENTITY CARD
        ========================= */}

        <div className="pf-hero">

          <div className="pf-identity">

            <div className="pf-avatar" aria-hidden="true">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="pf-identity-text">

              <p className="pf-eyebrow">Welcome back</p>

              <h1>{displayName}</h1>

              <p className="pf-meta">
                <span>{user?.email}</span>
                {memberSince && <span>Member since {memberSince}</span>}
              </p>

            </div>

          </div>

          <div className="pf-stats">

            <div className="pf-stat">
              <strong>{bookings.length}</strong>
              <span>Total trips</span>
            </div>

            <div className="pf-stat">
              <strong>{groups.upcoming.length}</strong>
              <span>Upcoming</span>
            </div>

            <div className="pf-stat">
              <strong>{groups.past.length}</strong>
              <span>Completed</span>
            </div>

            <div className="pf-stat">
              <strong>NPR {totalSpent.toLocaleString()}</strong>
              <span>Confirmed spend</span>
            </div>

          </div>

        </div>

        {/* =========================
            TABS + CONTENT
        ========================= */}

        <div className="pf-layout">

          <nav className="pf-nav" aria-label="Profile sections">

            {TABS.map(({ id, label, icon: Icon }) => (

              <button
                key={id}
                type="button"
                className={`pf-nav-item ${activeTab === id ? "active" : ""}`}
                aria-current={activeTab === id ? "page" : undefined}
                onClick={() => openTab(id)}
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
                {id === "trips" && groups.upcoming.length > 0 && (
                  <em className="pf-count">{groups.upcoming.length}</em>
                )}
              </button>

            ))}

            <button type="button" className="pf-nav-item pf-nav-logout" onClick={logout}>
              <FiLogOut aria-hidden="true" />
              <span>Log out</span>
            </button>

          </nav>

          <div className="pf-panel">

            {loading && <p className="pf-muted">Loading your profile...</p>}

            {!loading && loadError && (
              <div className="form-message error">{loadError}</div>
            )}

            {!loading && !loadError && activeTab === "overview" && (
              <OverviewTab
                nextTrip={groups.upcoming[0]}
                recent={bookings.slice(0, 3)}
                today={today}
                onOpenTab={openTab}
              />
            )}

            {!loading && !loadError && activeTab === "trips" && (
              <TripsTab groups={groups} today={today} onUpdated={replaceBooking} />
            )}

            {!loading && !loadError && activeTab === "reviews" && (
              <ReviewsTab
                reviews={reviews}
                hasTrips={groups.past.length > 0 || groups.upcoming.length > 0}
                onCreated={(review) => setReviews((list) => [review, ...list])}
              />
            )}

            {!loading && !loadError && activeTab === "account" && (
              <AccountTab user={user} onSaved={setUser} />
            )}

            {!loading && !loadError && activeTab === "security" && (
              <SecurityTab hasPassword={user?.has_password !== false} onLogout={logout} />
            )}

          </div>

        </div>

      </section>

      <Footer />

    </>

  );

}

/* =========================
   OVERVIEW
========================= */

function OverviewTab({ nextTrip, recent, today, onOpenTab }) {

  const quickActions = [
    { to: "/vehicles", icon: FiTruck, title: "Rent a vehicle", text: "SUVs, jeeps and luxury cars" },
    { to: "/packages", icon: FiMap, title: "Explore packages", text: "Curated tours across Nepal" },
    { tab: "reviews", icon: FiStar, title: "Write a review", text: "Tell others about your trip" },
    { to: "/contact", icon: FiHeadphones, title: "Get support", text: "We reply by email" },
  ];

  return (

    <div className="pf-stack">

      {/* NEXT TRIP */}

      <div className="pf-card">

        <div className="pf-card-head">
          <h2>Your next trip</h2>
          {nextTrip && (
            <button type="button" className="pf-link" onClick={() => onOpenTab("trips")}>
              All trips <FiArrowRight aria-hidden="true" />
            </button>
          )}
        </div>

        {nextTrip ? (

          <div className="pf-next-trip">

            <div className="pf-countdown">
              {nextTrip.pickup_date <= today ? (
                <><strong>Now</strong><span>on the road</span></>
              ) : (
                <><strong>{daysBetween(today, nextTrip.pickup_date)}</strong><span>days to go</span></>
              )}
            </div>

            <div className="pf-next-info">

              <h3>{tripTitle(nextTrip)}</h3>

              <p>
                <FiCalendar aria-hidden="true" />
                {formatDate(nextTrip.pickup_date)} → {formatDate(nextTrip.return_date)}
              </p>

              {nextTrip.driver_name && <p><FiUser aria-hidden="true" /> Driver: {nextTrip.driver_name}</p>}

              <StatusBadge status={nextTrip.status} />

              {nextTrip.status === "Pending" && (
                <p className="pf-hint">
                  <FiClock aria-hidden="true" /> Waiting for confirmation. We'll email you once it's approved.
                </p>
              )}

            </div>

          </div>

        ) : (

          <div className="pf-empty">
            <FiCompass aria-hidden="true" />
            <p>No upcoming trips yet. Where to next?</p>
            <Link to="/booking" className="pf-btn pf-btn--primary">Plan a trip</Link>
          </div>

        )}

      </div>

      {/* QUICK ACTIONS */}

      <div className="pf-actions">

        {quickActions.map(({ to, tab, icon: Icon, title, text }) => {

          const content = (
            <>
              <span className="pf-action-icon"><Icon aria-hidden="true" /></span>
              <span className="pf-action-text">
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
            </>
          );

          return to ? (
            <Link key={title} to={to} className="pf-action">{content}</Link>
          ) : (
            <button key={title} type="button" className="pf-action" onClick={() => onOpenTab(tab)}>{content}</button>
          );

        })}

      </div>

      {/* RECENT */}

      {recent.length > 0 && (

        <div className="pf-card">

          <div className="pf-card-head">
            <h2>Recent activity</h2>
          </div>

          <ul className="pf-activity">
            {recent.map((b) => (
              <li key={b.id}>
                <span className="pf-activity-icon">
                  {b.package_title ? <FiMap aria-hidden="true" /> : <FiTruck aria-hidden="true" />}
                </span>
                <span className="pf-activity-text">
                  <strong>{tripTitle(b)}</strong>
                  <small>Booked {new Date(b.created_at).toLocaleDateString()} · NPR {b.total_price.toLocaleString()}</small>
                </span>
                <StatusBadge status={b.status} />
              </li>
            ))}
          </ul>

        </div>

      )}

    </div>

  );

}

/* =========================
   MY TRIPS
========================= */

function TripsTab({ groups, today, onUpdated }) {

  const [filter, setFilter] = useState("upcoming");

  const [confirmingId, setConfirmingId] = useState(null);

  const [busyId, setBusyId] = useState(null);

  const [message, setMessage] = useState(null);

  const list = groups[filter];

  async function cancelTrip(b) {

    setBusyId(b.id);
    setMessage(null);

    try {

      const res = await API.put(`/bookings/cancel/${b.id}/`);
      onUpdated(res.data.booking);
      setMessage({ type: "success", text: `${tripTitle(b)} was cancelled. A confirmation email is on its way.` });

    } catch (err) {

      setMessage({ type: "error", text: getErrorMessage(err, "Could not cancel this trip.") });

    } finally {

      setBusyId(null);
      setConfirmingId(null);

    }

  }

  const filters = [
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (

    <div className="pf-stack">

      <div className="pf-card-head">
        <h2>My trips</h2>
        <Link to="/booking" className="pf-btn pf-btn--primary pf-btn--sm">+ New booking</Link>
      </div>

      <div className="pf-segment" role="tablist" aria-label="Trip status">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={filter === f.id ? "active" : ""}
            onClick={() => { setFilter(f.id); setConfirmingId(null); }}
          >
            {f.label} <em>{groups[f.id].length}</em>
          </button>
        ))}
      </div>

      {message && <div className={`form-message ${message.type}`} role="status">{message.text}</div>}

      {list.length === 0 && (
        <div className="pf-empty pf-card">
          <FiCalendar aria-hidden="true" />
          <p>No {filter} trips.</p>
          {filter === "upcoming" && <Link to="/vehicles" className="pf-btn pf-btn--primary">Browse vehicles</Link>}
        </div>
      )}

      {list.map((b) => {

        const nights = daysBetween(b.pickup_date, b.return_date) + 1;

        return (

          <article className="pf-trip" key={b.id}>

            <div className="pf-trip-icon">
              {b.package_title ? <FiMap aria-hidden="true" /> : <FiTruck aria-hidden="true" />}
            </div>

            <div className="pf-trip-body">

              <div className="pf-trip-top">
                <div>
                  <h3>{tripTitle(b)}</h3>
                  <small>Booking #{b.id}</small>
                </div>
                <StatusBadge status={b.status} />
              </div>

              <dl className="pf-trip-details">
                <div><dt>Dates</dt><dd>{formatDate(b.pickup_date)} → {formatDate(b.return_date)}</dd></div>
                <div><dt>Duration</dt><dd>{nights} {nights === 1 ? "day" : "days"}</dd></div>
                {b.vehicle_name && b.package_title && <div><dt>Vehicle</dt><dd>{b.vehicle_name}</dd></div>}
                <div><dt>Driver</dt><dd>{b.driver_name || "Not assigned yet"}</dd></div>
                <div><dt>Total</dt><dd><strong>NPR {b.total_price.toLocaleString()}</strong></dd></div>
              </dl>

              {b.special_request && <p className="pf-note">“{b.special_request}”</p>}

              {canCancel(b, today) && (

                confirmingId === b.id ? (

                  <div className="pf-confirm" role="alert">
                    <FiAlertCircle aria-hidden="true" />
                    <span>Cancel this trip? This can't be undone.</span>
                    <button type="button" className="pf-btn pf-btn--danger pf-btn--sm" disabled={busyId === b.id} onClick={() => cancelTrip(b)}>
                      {busyId === b.id ? "Cancelling..." : "Yes, cancel"}
                    </button>
                    <button type="button" className="pf-btn pf-btn--ghost pf-btn--sm" onClick={() => setConfirmingId(null)}>
                      Keep trip
                    </button>
                  </div>

                ) : (

                  <div className="pf-trip-actions">
                    <button type="button" className="pf-btn pf-btn--ghost pf-btn--sm" onClick={() => setConfirmingId(b.id)}>
                      <FiXCircle aria-hidden="true" /> Cancel trip
                    </button>
                  </div>

                )

              )}

              {filter === "upcoming" && !canCancel(b, today) && (
                <p className="pf-hint">
                  <FiClock aria-hidden="true" /> Trip in progress. Contact support to make changes.
                </p>
              )}

            </div>

          </article>

        );

      })}

    </div>

  );

}

/* =========================
   REVIEWS
========================= */

function ReviewsTab({ reviews, hasTrips, onCreated }) {

  const [rating, setRating] = useState(5);

  const [hover, setHover] = useState(0);

  const [comment, setComment] = useState("");

  const [sending, setSending] = useState(false);

  const [message, setMessage] = useState(null);

  async function submit(e) {

    e.preventDefault();

    setSending(true);
    setMessage(null);

    try {

      await API.post("/support/reviews/create/", { rating, comment });

      const mine = await API.get("/support/reviews/my/");

      onCreated(mine.data[0]);
      setComment("");
      setRating(5);
      setMessage({ type: "success", text: "Thanks! Your review will appear once our team approves it." });

    } catch (err) {

      setMessage({ type: "error", text: getErrorMessage(err) });

    } finally {

      setSending(false);

    }

  }

  const shown = hover || rating;

  return (

    <div className="pf-stack">

      <div className="pf-card">

        <div className="pf-card-head">
          <h2>Write a review</h2>
        </div>

        {!hasTrips && <p className="pf-hint"><FiCompass aria-hidden="true" /> Reviews are most helpful after a trip, but you're welcome to share now.</p>}

        <form className="pf-form" onSubmit={submit}>

          {message && <div className={`form-message ${message.type}`} role="status">{message.text}</div>}

          <div className="pf-field">

            <span className="pf-label" id="rating-label">Your rating</span>

            <div className="pf-stars" role="radiogroup" aria-labelledby="rating-label" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  className={n <= shown ? "on" : ""}
                  onMouseEnter={() => setHover(n)}
                  onClick={() => setRating(n)}
                >
                  ★
                </button>
              ))}
              <span className="pf-stars-text">{["", "Poor", "Fair", "Good", "Very good", "Excellent"][shown]}</span>
            </div>

          </div>

          <div className="pf-field">
            <label className="pf-label" htmlFor="review-comment">Your review</label>
            <textarea
              id="review-comment"
              rows={4}
              maxLength={1000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you enjoy? How was the vehicle and driver?"
              required
            />
            <small className="pf-muted">{comment.length}/1000</small>
          </div>

          <div>
            <button type="submit" className="pf-btn pf-btn--primary" disabled={sending || !comment.trim()}>
              {sending ? "Submitting..." : "Submit review"}
            </button>
          </div>

        </form>

      </div>

      <div className="pf-card">

        <div className="pf-card-head">
          <h2>Your reviews</h2>
        </div>

        {reviews.length === 0 && <p className="pf-muted">You haven't written any reviews yet.</p>}

        <ul className="pf-review-list">
          {reviews.map((r) => (
            <li key={r.id}>
              <div className="pf-review-top">
                <span className="pf-review-stars" aria-label={`${r.rating} out of 5 stars`}>
                  {"★".repeat(r.rating)}<span>{"★".repeat(5 - r.rating)}</span>
                </span>
                <span className={`pf-status ${r.is_approved ? "pf-status--approved" : "pf-status--pending"}`}>
                  {r.is_approved ? "Published" : "Awaiting approval"}
                </span>
              </div>
              <p>{r.comment}</p>
              <small className="pf-muted">{new Date(r.created_at).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>

      </div>

    </div>

  );

}

/* =========================
   ACCOUNT
========================= */

function AccountTab({ user, onSaved }) {

  const [name, setName] = useState(user?.name || "");

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState(null);

  const changed = name.trim() !== (user?.name || "");

  async function save(e) {

    e.preventDefault();

    setSaving(true);
    setMessage(null);

    try {

      const res = await API.put("/users/me/", { name: name.trim() });

      // Keep the stored user (used by the navbar / admin checks) in sync.
      const stored = getStoredUser() || {};
      localStorage.setItem("user", JSON.stringify({ ...stored, name: res.data.name }));

      onSaved(res.data);
      setMessage({ type: "success", text: "Your details were saved." });

    } catch (err) {

      setMessage({ type: "error", text: getErrorMessage(err) });

    } finally {

      setSaving(false);

    }

  }

  return (

    <div className="pf-card">

      <div className="pf-card-head">
        <h2>Account details</h2>
      </div>

      <form className="pf-form" onSubmit={save}>

        {message && <div className={`form-message ${message.type}`} role="status">{message.text}</div>}

        <div className="pf-field">
          <label className="pf-label" htmlFor="account-name">Full name</label>
          <div className="pf-input-icon">
            <FiEdit3 aria-hidden="true" />
            <input id="account-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={150} required />
          </div>
          <small className="pf-muted">Shown on your bookings and reviews.</small>
        </div>

        <div className="pf-field">
          <label className="pf-label" htmlFor="account-email">Email address</label>
          <input id="account-email" value={user?.email || ""} readOnly disabled />
          <small className="pf-muted">Your email is your login. Contact support to change it.</small>
        </div>

        <div className="pf-field">
          <span className="pf-label">Member since</span>
          <p>{user?.date_joined ? new Date(user.date_joined).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : "-"}</p>
        </div>

        <div className="pf-form-actions">
          <button type="submit" className="pf-btn pf-btn--primary" disabled={saving || !changed}>
            {saving ? "Saving..." : "Save changes"}
          </button>
          {changed && (
            <button type="button" className="pf-btn pf-btn--ghost" onClick={() => setName(user?.name || "")}>
              Discard
            </button>
          )}
        </div>

      </form>

    </div>

  );

}

/* =========================
   SECURITY
========================= */

function SecurityTab({ hasPassword, onLogout }) {

  const [current, setCurrent] = useState("");

  const [next, setNext] = useState("");

  const [confirm, setConfirm] = useState("");

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState(null);

  const strength = passwordStrength(next);

  const mismatch = confirm && next !== confirm;

  async function submit(e) {

    e.preventDefault();

    if (next !== confirm) return;

    setSaving(true);
    setMessage(null);

    try {

      const res = await API.post("/users/change-password/", {
        current_password: current,
        new_password: next,
      });

      setMessage({ type: "success", text: res.data.message });
      setCurrent("");
      setNext("");
      setConfirm("");

    } catch (err) {

      setMessage({ type: "error", text: getErrorMessage(err) });

    } finally {

      setSaving(false);

    }

  }

  return (

    <div className="pf-stack">

      <div className="pf-card">

        <div className="pf-card-head">
          <h2>{hasPassword ? "Change password" : "Set a password"}</h2>
        </div>

        {!hasPassword && (
          <p className="pf-hint"><FiAlertCircle aria-hidden="true" /> You signed up with Google. Set a password to also log in with your email.</p>
        )}

        <form className="pf-form" onSubmit={submit}>

          {message && <div className={`form-message ${message.type}`} role="status">{message.text}</div>}

          {hasPassword && (
            <div className="pf-field">
              <label className="pf-label" htmlFor="pw-current">Current password</label>
              <PasswordInput id="pw-current" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
            </div>
          )}

          <div className="pf-field">
            <label className="pf-label" htmlFor="pw-new">New password</label>
            <PasswordInput id="pw-new" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" minLength={8} required />
            {next && (
              <div className={`pf-strength pf-strength--${strength.level}`} aria-live="polite">
                <span className="pf-strength-bar"><i /><i /><i /><i /></span>
                <small>{strength.label}</small>
              </div>
            )}
            <small className="pf-muted">At least 8 characters. Mix letters, numbers and symbols for a stronger password.</small>
          </div>

          <div className="pf-field">
            <label className="pf-label" htmlFor="pw-confirm">Confirm new password</label>
            <PasswordInput id="pw-confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
            {mismatch && <small className="pf-error">Passwords don't match.</small>}
          </div>

          <div>
            <button type="submit" className="pf-btn pf-btn--primary" disabled={saving || mismatch || !next}>
              {saving ? "Updating..." : "Update password"}
            </button>
          </div>

        </form>

      </div>

      <div className="pf-card pf-card--row">

        <div>
          <h2>Sign out</h2>
          <p className="pf-muted">Log out of your account on this device.</p>
        </div>

        <button type="button" className="pf-btn pf-btn--danger" onClick={onLogout}>
          <FiLogOut aria-hidden="true" /> Log out
        </button>

      </div>

      <p className="pf-muted pf-secure-note">
        <FiCheckCircle aria-hidden="true" /> Your password is stored encrypted. Yatra staff can never see it.
      </p>

    </div>

  );

}

export default ProfileHome;
