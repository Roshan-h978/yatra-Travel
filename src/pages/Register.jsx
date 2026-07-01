import API from "../api/api";

import { useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import { FcGoogle } from "react-icons/fc";

import "./Register.css";

function Register() {

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

    if(password.length < 6){

      setError(
        "Password must be at least 6 characters"
      );

      return;

    }

    try{

      setLoading(true);

      await API.post(
        "/users/register/",
        {

          full_name:name,

          email:email,

          password:password

        }
      );

      setShowPopup(true);


    }

    catch(err){
      console.error(err);
      setError("Registration failed. Please try again.");
    }

    finally{

      setLoading(false);

    }

  }

  /* =========================
     GOOGLE REGISTER
  ========================= */

  function handleGoogleRegister(){

    alert(
      "Google Authentication Integration Coming Soon"
    );

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

              <div className="error-box">

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

                <label>
                  Full Name
                </label>

                <input
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

                <label>
                  Email Address
                </label>

                <input
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

                <label>
                  Password
                </label>

                <input
                  type="password"
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

                <label>
                  Confirm Password
                </label>

                <input
                  type="password"
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

            <button
              className="google-register-btn"
              onClick={handleGoogleRegister}
            >

              <FcGoogle size={24} />

              <span>
                Continue with Google
              </span>

            </button>

            {/* LOGIN LINK */}

            <div className="login-link">

              <p>
                Already have an account?
              </p>

              <a href="/login">

                Login Here

              </a>

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

                window.location.href =
                "/login";

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