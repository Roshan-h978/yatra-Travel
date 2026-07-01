import {

  useNavigate

}

from "react-router-dom";

import "./Topbar.css";

function Topbar(){

  const navigate = useNavigate();

  /* =========================
     GET ADMIN USER
  ========================= */

  const user = JSON.parse(

    localStorage.getItem("user")

  );

  /* =========================
     LOGOUT
  ========================= */

  function handleLogout(){

    localStorage.clear();

    navigate("/login");

    window.location.reload();

  }

  return (

    <div className="topbar">

      {/* =========================
          LEFT
      ========================= */}

      <div className="topbar-left">

        <h1>

          Yatra Admin Dashboard

        </h1>

        <p>

          Manage your luxury travel platform

        </p>

      </div>

      {/* =========================
          RIGHT
      ========================= */}

      <div className="topbar-right">

        {/* SEARCH */}

        <div className="search-box">

          <input

            type="text"

            placeholder="Search bookings, packages, customers..."

          />

        </div>

        {/* NOTIFICATION */}

        <div className="notification-icon">

          🔔

          <span>

            3

          </span>

        </div>

        {/* WEBSITE BUTTON */}

        <button

          className="frontend-btn"

          onClick={()=>navigate("/")}

        >

          Open Website

        </button>

        {/* ADMIN PROFILE */}

        <div className="admin-profile">

          <div className="admin-avatar">

            {

              user?.name

              ?

              user.name.charAt(0).toUpperCase()

              :

              "A"

            }

          </div>

          <div className="admin-details">

            <h4>

              {

                user?.name ||

                "Admin"

              }

            </h4>

            <span>

              Super Administrator

            </span>

          </div>

        </div>

        {/* LOGOUT */}

        <button

          className="logout-top-btn"

          onClick={handleLogout}

        >

          Logout

        </button>

      </div>

    </div>

  );

}

export default Topbar;