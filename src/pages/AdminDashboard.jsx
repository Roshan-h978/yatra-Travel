import { useState } from "react";

import "./AdminDashboard.css";

/* ADMIN COMPONENTS */

import Sidebar from "../components/admin/Sidebar";

import Topbar from "../components/admin/Topbar";

import DashboardOverview from "../components/admin/DashboardOverview";

import VehicleManagement from "../components/admin/VehicleManagement";

import PackageManagement from "../components/admin/PackageManagement";

import BookingManagement from "../components/admin/BookingManagement";

import DriverManagement from "../components/admin/DriverManagement";

import CustomerManagement from "../components/admin/CustomerManagement";

import ReviewManagement from "../components/admin/ReviewManagement";

import AnalyticsSection from "../components/admin/AnalyticsSection";

import SupportSection from "../components/admin/SupportSection";

function AdminDashboard() {

  const [activeSection,setActiveSection] =
  useState("dashboard");

  function renderSection(){

    switch(activeSection){

      case "dashboard":

        return <DashboardOverview />;

      case "vehicles":

        return <VehicleManagement />;

      case "packages":

        return <PackageManagement />;

      case "bookings":

        return <BookingManagement />;

      case "drivers":

        return <DriverManagement />;

      case "customers":

        return <CustomerManagement />;

      case "reviews":

        return <ReviewManagement />;

      case "analytics":

        return <AnalyticsSection />;

      case "support":

        return <SupportSection />;

      default:

        return <DashboardOverview />;

    }

  }

  return (

    <div className="admin-dashboard-page">

      {/* SIDEBAR */}

      <Sidebar

        activeSection={activeSection}

        setActiveSection={setActiveSection}

      />

      {/* MAIN */}

      <div className="admin-main">

        <Topbar />

        <div className="admin-content">

          {

            renderSection()

          }

        </div>

      </div>

    </div>

  );

}

export default AdminDashboard;