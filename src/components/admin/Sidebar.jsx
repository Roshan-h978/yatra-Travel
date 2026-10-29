import "./Sidebar.css";

import { FiLogOut, FiX } from "react-icons/fi";

import { getStoredUser } from "../../api/api";

import useLogout from "../../hooks/useLogout";

import ADMIN_MENU from "./adminMenu";

function Sidebar({ activeSection, onSelect, open, onClose }) {

  const user = getStoredUser();

  const name = user?.name || user?.email || "Admin";

  const handleLogout = useLogout();

  return (

    <>

      {/* Dark backdrop behind the drawer on small screens */}
      <div
        className={`admin-sidebar-backdrop ${open ? "show" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`admin-sidebar ${open ? "open" : ""}`}>

        {/* LOGO */}

        <div className="admin-logo">

          <div className="logo-circle">Y</div>

          <div className="admin-logo-text">
            <h1>YATRA</h1>
            <span>Admin Panel</span>
          </div>

          <button
            type="button"
            className="admin-sidebar-close"
            aria-label="Close menu"
            onClick={onClose}
          >
            <FiX />
          </button>

        </div>

        {/* MENU */}

        <nav className="admin-menu" aria-label="Admin sections">

          <p className="admin-menu-label">Menu</p>

          {ADMIN_MENU.map(({ id, title, icon: Icon }) => (

            <button
              key={id}
              type="button"
              aria-current={activeSection === id ? "page" : undefined}
              className={`admin-menu-item ${activeSection === id ? "active" : ""}`}
              onClick={() => onSelect(id)}
            >
              <Icon className="menu-icon" aria-hidden="true" />
              <span>{title}</span>
            </button>

          ))}

        </nav>

        {/* FOOTER */}

        <div className="sidebar-footer">

          <div className="admin-user">

            <div className="sidebar-avatar">
              {name.charAt(0).toUpperCase()}
            </div>

            <div className="admin-user-text">
              <h4>{name}</h4>
              <span>{user?.is_superuser ? "Super Administrator" : "Administrator"}</span>
            </div>

          </div>

          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
          >
            <FiLogOut aria-hidden="true" />
            Logout
          </button>

        </div>

      </aside>

    </>

  );

}

export default Sidebar;
