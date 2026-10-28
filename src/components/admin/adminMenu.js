import {
  FiBarChart2,
  FiCalendar,
  FiGrid,
  FiMap,
  FiMessageSquare,
  FiStar,
  FiTruck,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

// Admin sections, in sidebar order. Shared by the Sidebar and the Topbar title.
const ADMIN_MENU = [
  { id: "dashboard", title: "Dashboard", icon: FiGrid },
  { id: "bookings", title: "Bookings", icon: FiCalendar },
  { id: "vehicles", title: "Vehicles", icon: FiTruck },
  { id: "packages", title: "Packages", icon: FiMap },
  { id: "drivers", title: "Drivers", icon: FiUserCheck },
  { id: "customers", title: "Customers", icon: FiUsers },
  { id: "reviews", title: "Reviews", icon: FiStar },
  { id: "support", title: "Support", icon: FiMessageSquare },
  { id: "analytics", title: "Analytics", icon: FiBarChart2 },
];

export default ADMIN_MENU;
