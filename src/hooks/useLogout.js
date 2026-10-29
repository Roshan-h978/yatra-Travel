import { useNavigate } from "react-router-dom";

import { clearAuth } from "../api/api";

// Returns a function that signs the user out and sends them to the login page.
export default function useLogout() {

  const navigate = useNavigate();

  return function logout() {

    clearAuth();

    navigate("/login", { replace: true });

  };

}
