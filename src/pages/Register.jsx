import API, { getErrorMessage, isAdminUser, saveAuth } from "../api/api";

import { Link, useNavigate } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";

import { useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import PasswordInput from "../components/PasswordInput/PasswordInput";

import "./Register.css";

function Register() {

  const navigate = useNavigate();

  /* =========================
     STATES
  ========================= */

  const [name,setName] =
  useState("");

  const [email,setEmail] =
  useState("");

  const [password,setPassword] =
  useState("");

  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");

  const [showPopup,setShowPopup] =
  useState(false);

  const [loading,setLoading] =
  useState(false);

  const [error,setError] =
  useState("");

  /* =========================
     REGISTER FUNCTION
  ========================= */

  async function handleRegister(e){

    e.preventDefault();

    setError("");

    /* PASSWORD VALIDATION */

    if(password !== confirmPassword){

      setError(
        "Passwords do not match"
      );

      return;

    }

    /* PASSWORD LENGTH */

    if(password.length < 8){

      setError(
        "Password must be at least 8 characters"
      );

      return;

    }

    try{

      setLoading(true);

      const response = await API.post(
        "/users/register/",
        {

          full_name:name,

          email:email,

          password:password

        }
      );

      // The backend logs the new user in straight away.
      saveAuth(response.data);

      setShowPopup(true);


    }

    catch(err){
      setError(getErrorMessage(err, "Registration failed. Please try again."));
    }

    finally{

      setLoading(false);

    }

  }

  /* =========================
     GOOGLE REGISTER
  ========================= */

  async function handleGoogleRegister(credentialResponse){

    setError("");

    try{

      const response = await API.post(
        "/users/google-login/",
        { token: credentialResponse.credential }
      );

      saveAuth(response.data);

      navigate(isAdminUser(response.data.user) ? "/admin" : "/", { replace: true });

    }

    catch(err){

      setError(getErrorMessage(err, "Google sign-up failed. Please try again."));

    }

  }

  /* =========================
     COMPONENT
  ========================= */

  return (

    <>

      <Navbar />

      <section className="register-page">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="register-left">

          <div className="register-overlay"></div>

          <div className="register-content">

            <p>
              JOIN YATRA
            </p>

            <h1>
              Start Your
              Luxury Journey
            </h1>

            <span>
              Create your account and explore
              premium travel experiences
              across Nepal.
            </span>

          </div>

        </div>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="register-right">

          <div className="register-box">

            {/* HEADER */}

            <div className="register-header">

              <h2>
                Create Account
              </h2>

              <p>
                Register to continue with Yatra
              </p>

            </div>

            {/* ERROR MESSAGE */}

            {error && (

              <div className="form-message error">

                {error}

              </div>

            )}

            {/* FORM */}

            <form
              className="register-form"
              onSubmit={handleRegister}
            >

              {/* FULL NAME */}

              <div className="form-group">

                <label htmlFor="register-name">
                  Full Name
                </label>

                <input
                  id="register-name"
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e)=>
                    setName(e.target.value)
                  }
                  required
                />

              </div>

              {/* EMAIL */}

              <div className="form-group">

                <label htmlFor="register-email">
                  Email Address
                </label>

                <input
                  id="register-email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e)=>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

              {/* PASSWORD */}

              <div className="form-group">

                <label htmlFor="register-password">
                  Password
                </label>

                <PasswordInput
                  id="register-password"
                  autoComplete="new-password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e)=>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="form-group">

                <label htmlFor="register-confirm">
                  Confirm Password
                </label>

                <PasswordInput
                  id="register-confirm"
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e)=>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              {/* REGISTER BUTTON */}

              <button
                type="submit"
                className="register-btn"
                disabled={loading}
              >

                {loading
                  ? "Creating Account..."
                  : "Create Account"
                }

              </button>

            </form>

            {/* DIVIDER */}

            <div className="register-divider">

              <span></span>

              <p>
                OR
              </p>

              <span></span>

            </div>

            {/* GOOGLE BUTTON */}

            <div className="google-login-wrapper">


              <GoogleLogin

                text="signup_with"

                onSuccess={handleGoogleRegister}

                onError={() => setError("Google sign-up failed. Please try again.")}

              />


            </div>

            {/* LOGIN LINK */}

            <div className="login-link">

              <p>
                Already have an account?
              </p>

              <Link to="/login">

                Login Here

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          SUCCESS POPUP
      ========================= */}

      {showPopup && (

        <div className="popup-overlay">

          <div className="success-popup">

            <h2>
              Account Created Successfully
            </h2>

            <p>
              Your Yatra account has been registered successfully.
            </p>

            <button
              onClick={() => {

                setShowPopup(false);

                navigate(isAdminUser() ? "/admin" : "/", { replace: true });

              }}
            >

              Continue

            </button>

          </div>

        </div>

      )}

      <Footer />

    </>

  );
}

export default Register;