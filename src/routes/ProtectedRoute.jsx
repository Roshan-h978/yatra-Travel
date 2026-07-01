import { Navigate }

from "react-router-dom";

function ProtectedRoute({ children }) {

  /* CHECK TOKEN */

  const token =
  localStorage.getItem("access");

  /* NO TOKEN */

  if (!token) {

    return <Navigate to="/login" />;

  }

  /* ALLOW ACCESS */

  return children;

}

export default ProtectedRoute;