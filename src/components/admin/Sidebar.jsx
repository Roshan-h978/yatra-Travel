import "./Sidebar.css";

import {

  useNavigate

}

from "react-router-dom";

function Sidebar({

  activeSection,

  setActiveSection

}) {

  const navigate = useNavigate();

  /* =========================
     MENU ITEMS
  ========================= */

  const menuItems = [

    {

      id:"dashboard",

      title:"Dashboard",

      icon:"📊"

    },

    {

      id:"vehicles",

      title:"Vehicles",

      icon:"🚘"

    },

    {

      id:"packages",

      title:"Packages",

      icon:"🌍"

    },

    {

      id:"bookings",

      title:"Bookings",

      icon:"📅"

    },

    {

      id:"drivers",

      title:"Drivers",

      icon:"🧑‍✈️"

    },

    {

      id:"customers",

      title:"Customers",

      icon:"👥"

    },

    {

      id:"reviews",

      title:"Reviews",

      icon:"⭐"

    },

    {

      id:"analytics",

      title:"Analytics",

      icon:"📈"

    },

    {

      id:"support",

      title:"Support",

      icon:"💬"

    }

  ];

  /* =========================
     LOGOUT
  ========================= */

  function handleLogout(){

    localStorage.clear();

    navigate("/login");

    window.location.reload();

  }

  return (

    <aside className="admin-sidebar">

      {/* =========================
          LOGO
      ========================= */}

      <div className="admin-logo">

        <div className="logo-circle">

          Y

        </div>

        <div>

          <h1>

            YATRA

          </h1>

          <span>

            ADMIN PANEL

          </span>

        </div>

      </div>

      {/* =========================
          MENU
      ========================= */}

      <div className="admin-menu">

        {

          menuItems.map((item)=>(

            <button

              key={item.id}

              className={

                activeSection === item.id

                ?

                "admin-menu-item active"

                :

                "admin-menu-item"

              }

              onClick={()=>

                setActiveSection(item.id)

              }

            >

              <span className="menu-icon">

                {item.icon}

              </span>

              <span>

                {item.title}

              </span>

            </button>

          ))

        }

      </div>

      {/* =========================
          FOOTER
      ========================= */}

      <div className="sidebar-footer">

        <div className="admin-user">

          <div className="admin-avatar">

            A

          </div>

          <div>

            <h4>

              Admin

            </h4>

            <span>

              Super Administrator

            </span>

          </div>

        </div>

        <button

          className="logout-btn"

          onClick={handleLogout}

        >

          Logout

        </button>

      </div>

    </aside>

  );

}

export default Sidebar;