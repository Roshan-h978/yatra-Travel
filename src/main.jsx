import React from "react";

import ReactDOM from "react-dom/client";

import "./styles/global.css";

import App from "./App";

import {

  GoogleOAuthProvider

}

from "@react-oauth/google";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "1056481750509-tamjc8high1hpu06vcjs3c806o1st2cv.apps.googleusercontent.com";

ReactDOM.createRoot(

  document.getElementById("root")

).render(

  <React.StrictMode>

    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>

      <App />

    </GoogleOAuthProvider>

  </React.StrictMode>

);
