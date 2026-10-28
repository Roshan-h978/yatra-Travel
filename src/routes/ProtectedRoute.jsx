import { Navigate, useLocation } from "react-router-dom";

import { isLoggedIn } from "../api/api";

function ProtectedRoute({ children }) {

  const location = useLocation();

  if (!isLoggedIn()) {

    // Remember where the user was going so login can send them back.
    return <Navigate to="/login" replace state={{ from: location }} />;

  }

  return children;

}

export default ProtectedRoute;
