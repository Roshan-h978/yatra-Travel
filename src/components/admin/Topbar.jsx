import { useNavigate } from "react-router-dom";

import { FiExternalLink, FiLogOut, FiMenu } from "react-icons/fi";

import { getStoredUser } from "../../api/api";

import useLogout from "../../hooks/useLogout";

import "./Topbar.css";

function Topbar({ title, onMenuClick }) {

  const navigate = useNavigate();

  const user = getStoredUser();

  const name = user?.name || user?.email || "Admin";

  const handleLogout = useLogout();

  return (

    <header className="topbar">

      <div className="topbar-left">

        <button
          type="button"
          className="topbar-icon-btn topbar-menu-btn"
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          <FiMenu />
        </button>

        <div className="topbar-title">
          <span>Yatra Admin</span>
          <h1>{title}</h1>
        </div>

      </div>

      <div className="topbar-right">

        <button
          type="button"
          className="topbar-btn"
          onClick={() => navigate("/")}
          title="Open website"
        >
          <FiExternalLink aria-hidden="true" />
          <span className="topbar-btn-label">View Website</span>
        </button>

        <div className="admin-profile">

          <div className="topbar-avatar">
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="admin-details">
            <h4>{name}</h4>
            <span>{user?.is_superuser ? "Super Administrator" : "Administrator"}</span>
          </div>

        </div>

        <button
          type="button"
          className="topbar-icon-btn topbar-logout-btn"
          aria-label="Logout"
          title="Logout"
          onClick={handleLogout}
        >
          <FiLogOut />
        </button>

      </div>

    </header>

  );

}

export default Topbar;
