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
  "510753548896-l1vfu7jo2sjq43o0o3vqk83ned0hpopk.apps.googleusercontent.com";

ReactDOM.createRoot(

  document.getElementById("root")

).render(

  <React.StrictMode>

    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>

      <App />

    </GoogleOAuthProvider>

  </React.StrictMode>

);
