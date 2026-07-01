import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App";

import {

  GoogleOAuthProvider

}

from "@react-oauth/google";

ReactDOM.createRoot(

  document.getElementById("root")

).render(

  <React.StrictMode>

    <GoogleOAuthProvider

      clientId="1056481750509-tamjc8high1hpu06vcjs3c806o1st2cv.apps.googleusercontent.com"

    >

      <App />

    </GoogleOAuthProvider>

  </React.StrictMode>

);