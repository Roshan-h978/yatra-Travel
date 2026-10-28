import { lazy, Suspense } from "react";

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

import NotFound from "../pages/NotFound";

// Loaded only when an admin opens /admin, so admin code and CSS stay out of the public pages.
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));

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

        {/* PUBLIC: anyone can browse */}

        <Route path="/" element={<Home />} />

        <Route path="/vehicles" element={<Vehicles />} />

        <Route path="/packages" element={<Packages />} />

        <Route path="/services" element={<Services />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<Register />} />

        {/* LOGGED-IN CUSTOMERS */}

        <Route

          path="/booking"

          element={

            <ProtectedRoute>

              <Booking />

            </ProtectedRoute>

          }

        />

        <Route

          path="/profile"

          element={

            <ProtectedRoute>

              <ProfileHome />

            </ProtectedRoute>

          }

        />

        {/* ADMIN */}

        <Route

          path="/admin"

          element={

            <AdminRoute>

              <Suspense fallback={<div className="state-message">Loading dashboard...</div>}>

                <AdminDashboard />

              </Suspense>

            </AdminRoute>

          }

        />

        <Route path="*" element={<NotFound />} />

      </Routes>

    </BrowserRouter>

  );

}

export default AppRoutes;
