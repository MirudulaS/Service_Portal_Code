import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../api/axios";

export default function AdminLayout({ children, pageTitle, pageSubtitle }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  // Get unread notification count
  useEffect(() => {
    api.get("/notifications/unread-count")
      .then((response) => {
        setUnreadCount(response.data.count);
      })
      .catch(() => {});
  }, []);

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout-wrapper">

      {/* Sidebar */}
      <aside className="sidebar">

        <h2>College Service</h2>
        <p>Administration Portal</p>

        <ul>
          <li>
            <NavLink to="/admin/dashboard">
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/requests">
              Service Requests
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/users">
              Users
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/technicians">
              Technicians
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/categories">
              Categories
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/notifications">
              Notifications
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/notices">
              Notice Board
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/reports">
              Reports
            </NavLink>
          </li>
        </ul>

        {/* User information */}
        <div className="user-info">
          <div>{user?.name}</div>
          <div>{user?.role}</div>
        </div>

        <button onClick={handleLogout}>
          Sign Out
        </button>

      </aside>


      {/* Main content */}
      <main className="main-content">

        <nav className="top-navbar">

          <div>
            <h2>{pageTitle}</h2>
            <p>{pageSubtitle}</p>
          </div>

          <div>

            {/* Theme button */}
            <button onClick={toggleTheme}>
              {theme === "light" ? "Dark" : "Light"}
            </button>

            {/* Notification button */}
            <button onClick={() => navigate("/admin/notifications")}>
              Notifications

              {unreadCount > 0 && (
                <span>{unreadCount}</span>
              )}
            </button>

          </div>

        </nav>

        {/* Current page appears here */}
        <div className="page-content">
          {children}
        </div>

      </main>

    </div>
  );
}