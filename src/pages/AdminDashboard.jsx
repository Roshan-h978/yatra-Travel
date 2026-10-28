import { useState } from "react";

import "./AdminDashboard.css";

import "../components/admin/AdminCommon.css";

/* ADMIN COMPONENTS */

import Sidebar from "../components/admin/Sidebar";

import Topbar from "../components/admin/Topbar";

import ADMIN_MENU from "../components/admin/adminMenu";

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

  const [activeSection, setActiveSection] = useState("dashboard");

  // Drawer state for tablet / phone widths.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function selectSection(id) {

    setActiveSection(id);

    setSidebarOpen(false);

    window.scrollTo({ top: 0 });

  }

  function renderSection() {

    switch (activeSection) {

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
        return <DashboardOverview onNavigate={selectSection} />;

    }

  }

  const title = ADMIN_MENU.find((item) => item.id === activeSection)?.title || "Dashboard";

  return (

    <div className="admin-dashboard-page">

      <Sidebar
        activeSection={activeSection}
        onSelect={selectSection}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-main">

        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />

        <main className="admin-content">

          {renderSection()}

        </main>

      </div>

    </div>

  );

}

export default AdminDashboard;
