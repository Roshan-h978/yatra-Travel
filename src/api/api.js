import axios from "axios";

const API = axios.create({

  baseURL:
  "http://127.0.0.1:8000/api"

});

/* =========================
   AUTO TOKEN
========================= */

API.interceptors.request.use(

  (config)=>{

    const token =
    localStorage.getItem("access");

    const publicPaths = [
      "/users/login/",
      "/users/register/",
      "/users/google-login/",
      "/token/",
      "/token/refresh/",
    ];

    const isPublicRequest = publicPaths.some((path) =>
      config.url?.includes(path)
    );

    if (token && !isPublicRequest) {
      config.headers.Authorization =
      `Bearer ${token}`;
    }

    return config;

  }

);

export default API;