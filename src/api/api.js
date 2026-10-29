import axios from "axios";

// Accepts the backend address with or without "/api" and a trailing slash,
// e.g. "https://x.onrender.com", "https://x.onrender.com/" or ".../api".
function normalizeApiUrl(url) {

  const base = url.trim().replace(/\/+$/, "");

  return base.endsWith("/api") ? base : `${base}/api`;

}

const API_BASE_URL = normalizeApiUrl(
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"
);

const API = axios.create({

  baseURL: API_BASE_URL

});

/* =========================
   AUTH STORAGE HELPERS
========================= */

const AUTH_KEYS = ["access", "refresh", "user"];

export function saveAuth(data) {

  localStorage.setItem("access", data.access);

  localStorage.setItem("refresh", data.refresh);

  localStorage.setItem("user", JSON.stringify(data.user));

}

export function clearAuth() {

  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));

}

export function getStoredUser() {

  try {

    return JSON.parse(localStorage.getItem("user")) || null;

  } catch {

    return null;

  }

}

export function isLoggedIn() {

  return Boolean(localStorage.getItem("access"));

}

export function isAdminUser(user = getStoredUser()) {

  // Matches the backend's IsAdminUser check (is_staff).
  return Boolean(user?.is_admin);

}

export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {

  // No response at all: server down / asleep, wrong API address, or blocked by CORS.
  if (error && !error.response) {

    return "Can't reach the server right now. Please try again in a minute.";

  }

  const data = error?.response?.data;

  if (!data) return fallback;

  if (typeof data === "string") return fallback;

  if (data.error) return data.error;

  if (data.detail) return data.detail;

  // DRF field errors: { field: ["msg"], non_field_errors: ["msg"] }
  const [key, first] = Object.entries(data)[0] || [];

  if (!Array.isArray(first)) return fallback;

  return key === "non_field_errors" ? first[0] : `${key.replace(/_/g, " ")}: ${first[0]}`;

}

/* =========================
   AUTO TOKEN
========================= */

const publicPaths = [
  "/users/login/",
  "/users/register/",
  "/users/google-login/",
  "/token/refresh/",
];

const isPublicRequest = (url = "") =>
  publicPaths.some((path) => url.includes(path));

API.interceptors.request.use((config) => {

  const token = localStorage.getItem("access");

  if (token && !isPublicRequest(config.url)) {

    config.headers.Authorization = `Bearer ${token}`;

  }

  return config;

});

/* =========================
   AUTO REFRESH ON 401
========================= */

let refreshRequest = null;

function retryAnonymously(original) {

  clearAuth();

  delete original.headers.Authorization;

  return API(original).catch((retryError) => {

    if (retryError.response?.status === 401) {

      const next = window.location.pathname + window.location.search;

      window.location.assign(`/login?next=${encodeURIComponent(next)}`);

    }

    return Promise.reject(retryError);

  });

}

API.interceptors.response.use(

  (response) => response,

  async (error) => {

    const original = error.config;

    const refresh = localStorage.getItem("refresh");

    if (
      error.response?.status !== 401 ||
      !original ||
      original._retry ||
      isPublicRequest(original.url)
    ) {

      return Promise.reject(error);

    }

    original._retry = true;

    if (!refresh) {

      // Stale access token with no refresh token: drop it and retry anonymously.
      return retryAnonymously(original);

    }

    try {

      // Share one refresh call between requests that fail at the same time.
      refreshRequest =
        refreshRequest ||
        axios.post(`${API_BASE_URL}/token/refresh/`, { refresh });

      const { data } = await refreshRequest;

      localStorage.setItem("access", data.access);

      original.headers.Authorization = `Bearer ${data.access}`;

      return API(original);

    } catch {

      // Session is over. Retry without a token so public pages keep working;
      // only send the user to login if the endpoint really needs an account.
      return retryAnonymously(original);

    } finally {

      refreshRequest = null;

    }

  }

);

export default API;
