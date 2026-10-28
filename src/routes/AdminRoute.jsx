import { Navigate, useLocation } from "react-router-dom";

import { isAdminUser, isLoggedIn } from "../api/api";

// UI guard only. The backend enforces admin permissions on every admin endpoint.
function AdminRoute({ children }) {

  const location = useLocation();

  if (!isLoggedIn()) {

    return <Navigate to="/login" replace state={{ from: location }} />;

  }

  if (!isAdminUser()) {

    return <Navigate to="/" replace />;

  }

  return children;

}

export default AdminRoute;
