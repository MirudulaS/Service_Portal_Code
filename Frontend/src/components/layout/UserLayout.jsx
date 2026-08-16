import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../api/axios";

const navItems = [
  { label: "Dashboard", path: "/user/dashboard" },
  { label: "Submit Request", path: "/user/submit-request" },
  { label: "My Requests", path: "/user/my-requests" },
  { label: "Notifications", path: "/user/notifications" },
  { label: "Notice Board", path: "/user/notices" },
  { label: "My Profile", path: "/user/profile" }
];

export default function UserLayout({ children, pageTitle, pageSubtitle }) {

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
        <p>Student / Staff Portal</p>

        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* User information */}
        <div className="user-info">
          <div>{user?.name}</div>
          <div>{user?.department || "Student / Staff"}</div>
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

            {/* Theme */}
            <button onClick={toggleTheme}>
              {theme === "light" ? "Dark" : "Light"}
            </button>

            {/* Notifications */}
            <button onClick={() => navigate("/user/notifications")}>
              🔔 {unreadCount > 0 && unreadCount}
            </button>

          </div>

        </nav>

        {/* Current page */}
        <div className="page-content">
          {children}
        </div>

      </main>

    </div>
  );
}