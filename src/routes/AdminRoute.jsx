import {

  Navigate

}

from "react-router-dom";

function AdminRoute({ children }) {

  /* =========================
     GET USER
  ========================= */

  const storedUser =
  localStorage.getItem("user");

  /* =========================
     NO USER
  ========================= */

  if(!storedUser){

    return <Navigate to="/login" />;

  }

  /* =========================
     PARSE USER
  ========================= */

  const user =
  JSON.parse(storedUser);

  /* =========================
     ADMIN CHECK
  ========================= */

  if(

    !user.is_admin &&

    !user.is_superuser

  ){

    return <Navigate to="/" />;

  }

  /* =========================
     ALLOW ACCESS
  ========================= */

  return children;

}

export default AdminRoute;