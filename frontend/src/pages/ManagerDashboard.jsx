 
import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems = [
    { label: "Overview", path: "/manager/overview" },
    { label: "Live Trips", path: "/manager/livetrips" },
    { label: "Previous Trips", path: "/manager/previoustrips" },
    { label: "Analyse Data", path: "/manager/analyse" },
    { label: "See Report", path: "/manager/report" },
    { label: "Notification", path: "/manager/notifications" },
  ];

  const handleLogout = () => navigate("/");

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="top-sidebar">
          <div className="sidebar-title">
            📘 {!isCollapsed && "Dashboard Kit"}
          </div>
          <button
            className="toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? "➡️" : "⬅️"}
          </button>
        </div>

        <nav className="menu">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.label}
              label={item.label}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              collapsed={isCollapsed}
            />
          ))}
        </nav>

        <div className="logout" onClick={handleLogout}>
          {!isCollapsed && "Logout"}
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

const SidebarItem = ({ label, active, onClick, collapsed }) => (
  <div
    className={`sidebar-item ${active ? "active" : ""}`}
    onClick={onClick}
    title={collapsed ? label : ""}
  >
    {!collapsed && label}
  </div>
);

export default ManagerDashboard;
