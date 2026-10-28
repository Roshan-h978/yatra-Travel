import API, { getErrorMessage, isAdminUser, saveAuth } from "../api/api";

import { useState } from "react";

import { useNavigate, useLocation, useSearchParams, Link } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";

import Navbar from "../components/Navbar/Navbar";

import Footer from "../components/Footer/Footer";

import PasswordInput from "../components/PasswordInput/PasswordInput";

import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const [searchParams] = useSearchParams();

  /* =========================
     STATES
  ========================= */

  const [login, setLogin] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /* =========================
     AFTER LOGIN
  ========================= */

  function finishLogin(data) {
    saveAuth(data);

    // Admins go to the dashboard. Customers return to the page they were trying to open
    // (including its ?query, e.g. /booking?vehicle=3), otherwise to the home page.
    const from = location.state?.from;

    const fromPath = from
      ? `${from.pathname}${from.search || ""}${from.hash || ""}`
      : searchParams.get("next");

    if (isAdminUser(data.user)) {
      navigate("/admin", { replace: true });
    } else {
      navigate(
        // Same-site paths only: one leading "/" (not "//" or "/\", which browsers treat as another site).
        fromPath && /^\/(?![/\\])/.test(fromPath) && !fromPath.startsWith("/login")
          ? fromPath
          : "/",
        { replace: true }
      );
    }
  }

  /* =========================
     NORMAL LOGIN
  ========================= */

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      const response = await API.post("/users/login/", { login, password });

      finishLogin(response.data);
    } catch (err) {
      setError(getErrorMessage(err, "Invalid login. Please check your details."));
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     GOOGLE LOGIN
  ========================= */

  async function handleGoogleSuccess(credentialResponse) {
    setError("");

    try {
      const response = await API.post("/users/google-login/", {
        token: credentialResponse.credential,
      });

      finishLogin(response.data);
    } catch (err) {
      setError(getErrorMessage(err, "Google login failed. Please try again."));
    }
  }

  return (
    <>
      <Navbar />

      <section className="login-page">
        {/* LEFT SIDE */}

        <div className="login-left">
          <div className="login-overlay"></div>

          <div className="login-content">
            <p>WELCOME TO YATRA</p>

            <h1>Explore Nepal In Luxury</h1>

            <span>
              Premium tours, luxury vehicle rentals, and unforgettable travel
              experiences across Nepal.
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="login-right">
          <div className="login-box">
            {/* HEADER */}

            <div className="login-header">
              <h2>Login Account</h2>

              <p>Continue your luxury journey</p>
            </div>

            {error && <div className="form-message error" role="alert">{error}</div>}

            {/* LOGIN FORM */}

            <form className="login-form" onSubmit={handleLogin}>
              {/* USERNAME / EMAIL */}

              <div className="form-group">
                <label htmlFor="login">Username or Email</label>

                <input
                  id="login"
                  name="login"
                  type="text"
                  placeholder="Enter username or email"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              {/* PASSWORD */}

              <div className="form-group">
                <label htmlFor="password">Password</label>

                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="login-btn-main"
                disabled={loading}
              >
                {loading ? "Logging In..." : "Login Account"}
              </button>
            </form>

            {/* DIVIDER */}

            <div className="login-divider">
              <span></span>

              <p>OR</p>

              <span></span>
            </div>

            {/* GOOGLE LOGIN */}

            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google login failed. Please try again.")}
              />
            </div>

            {/* REGISTER */}

            <div className="signup-link">
              <p>Don’t have an account?</p>

              <Link to="/register">Create Account</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default LoginPage;
