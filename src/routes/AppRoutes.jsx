import {

  BrowserRouter,

  Routes,

  Route

}

from "react-router-dom";

/* =========================
   PAGES
========================= */

import Home from "../pages/Home";

import Vehicles from "../pages/Vehicles";

import Packages from "../pages/Packages";

import Booking from "../pages/Booking";

import Contact from "../pages/Contact";

import LoginPage from "../pages/LoginPage";

import Register from "../pages/Register";

import Services from "../pages/Services";

import ProfileHome from "../pages/ProfileHome";

import AdminDashboard from "../pages/AdminDashboard";

/* =========================
   ROUTE PROTECTION
========================= */

import ProtectedRoute
from "./ProtectedRoute";

import AdminRoute
from "./AdminRoute";

/* =========================
   APP ROUTES
========================= */

function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        {/* =========================
            HOME
        ========================= */}

        <Route

          path="/"

          element={<Home />}

        />

        {/* =========================
            VEHICLES
        ========================= */}

        <Route

          path="/vehicles"

          element={

            <ProtectedRoute>

              <Vehicles />

            </ProtectedRoute>

          }

        />

        {/* =========================
            PACKAGES
        ========================= */}

        <Route

          path="/packages"

          element={

            <ProtectedRoute>

              <Packages />

            </ProtectedRoute>

          }

        />

        {/* =========================
            BOOKING
        ========================= */}

        <Route

          path="/booking"

          element={

            <ProtectedRoute>

              <Booking />

            </ProtectedRoute>

          }

        />

        {/* =========================
            SERVICES
        ========================= */}

        <Route

          path="/services"

          element={

            <ProtectedRoute>

              <Services />

            </ProtectedRoute>

          }

        />

        {/* =========================
            PROFILE
        ========================= */}

        <Route

          path="/profile"

          element={

            <ProtectedRoute>

              <ProfileHome />

            </ProtectedRoute>

          }

        />

        {/* =========================
            ADMIN
        ========================= */}

        <Route

          path="/admin"

          element={

            <ProtectedRoute>

              <AdminRoute>

                <AdminDashboard />

              </AdminRoute>

            </ProtectedRoute>

          }

        />

        {/* =========================
            CONTACT
        ========================= */}

        <Route

          path="/contact"

          element={<Contact />}

        />

        {/* =========================
            LOGIN
        ========================= */}

        <Route

          path="/login"

          element={<LoginPage />}

        />

        {/* =========================
            REGISTER
        ========================= */}

        <Route

          path="/register"

          element={<Register />}

        />

      </Routes>

    </BrowserRouter>

  );

}

export default AppRoutes;