import API from "../api/api";

import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";

import Navbar from "../components/Navbar/Navbar";

import Footer from "../components/Footer/Footer";

import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  /* =========================
     STATES
  ========================= */

  const [login, setLogin] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  /* =========================
     NORMAL LOGIN
  ========================= */

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await API.post(
        "/users/login/",

        {
          login: login,

          password: password,
        },
      );

      /* =========================
       STORE TOKENS
    ========================= */

      localStorage.setItem("access", response.data.access);

      localStorage.setItem("refresh", response.data.refresh);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      localStorage.setItem("yatraUser", "true");

      /* =========================
       ADMIN REDIRECT
    ========================= */

      if (response.data.user.is_admin || response.data.user.is_superuser) {
        navigate("/admin");
      } else {
        navigate("/");
      }

      window.location.reload();
    } catch (error) {
      console.log(error);

      const errorData = error.response?.data;
      alert(
        errorData?.error ||
        errorData?.detail ||
        "Invalid Login"
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     GOOGLE LOGIN
  ========================= */

  async function handleGoogleSuccess(credentialResponse) {
    try {
      const response = await API.post(
        "/users/google-login/",

        {
          token: credentialResponse.credential,
        },
      );

      console.log(
        "GOOGLE LOGIN:",

        response.data,
      );

      /* SAVE TOKENS */

      localStorage.setItem(
        "access",

        response.data.access,
      );

      localStorage.setItem(
        "refresh",

        response.data.refresh,
      );

      /* SAVE USER */

      localStorage.setItem(
        "user",

        JSON.stringify(response.data.user),
      );

      localStorage.setItem(
        "yatraUser",

        "loggedin",
      );

      /* ADMIN CHECK */

      if (response.data.user.is_admin === true) {
        navigate("/admin");
      } else {
        navigate("/profile");
      }

      /* REFRESH */

      window.location.reload();
    } catch (error) {
      console.log(
        "GOOGLE LOGIN ERROR:",

        error.response?.data,
      );

      alert("Google Login Failed");
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

                <input
                  id="password"
                  name="password"
                  type="password"
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
                onError={() => {
                  alert("Google Login Failed");
                }}
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
