import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageRequests from "./pages/admin/ManageRequests";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageTechnicians from "./pages/admin/ManageTechnicians";
import ManageCategories from "./pages/admin/ManageCategories";
import AdminNotifications from "./pages/admin/AdminNotifications";
import NoticeBoard from "./pages/admin/NoticeBoard";
import Reports from "./pages/admin/Reports";

import UserDashboard from "./pages/user/UserDashboard";
import SubmitRequest from "./pages/user/SubmitRequest";
import MyRequests from "./pages/user/MyRequests";
import UserProfile from "./pages/user/UserProfile";
import UserNotifications from "./pages/user/UserNotifications";
import UserNotices from "./pages/user/UserNotices";

import TechnicianDashboard from "./pages/technician/TechnicianDashboard";
import AssignedTasks from "./pages/technician/AssignedTasks";
import TechNotifications from "./pages/technician/TechNotifications";

import "./styles/global.css";


export default function App() {

  return (

    <ThemeProvider>

      <AuthProvider>

        <Router>

          <Routes>

            <Route
              path="/"
              element={
                <Navigate to="/login" replace />
              }
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />


            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/requests"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ManageRequests />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/technicians"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ManageTechnicians />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ManageCategories />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminNotifications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/notices"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <NoticeBoard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />


            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute roles={["user"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/submit-request"
              element={
                <ProtectedRoute roles={["user"]}>
                  <SubmitRequest />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/my-requests"
              element={
                <ProtectedRoute roles={["user"]}>
                  <MyRequests />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/profile"
              element={
                <ProtectedRoute roles={["user"]}>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/notifications"
              element={
                <ProtectedRoute roles={["user"]}>
                  <UserNotifications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/notices"
              element={
                <ProtectedRoute roles={["user"]}>
                  <UserNotices />
                </ProtectedRoute>
              }
            />


            <Route
              path="/technician/dashboard"
              element={
                <ProtectedRoute roles={["technician"]}>
                  <TechnicianDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/technician/tasks"
              element={
                <ProtectedRoute roles={["technician"]}>
                  <AssignedTasks />
                </ProtectedRoute>
              }
            />

            <Route
              path="/technician/notifications"
              element={
                <ProtectedRoute roles={["technician"]}>
                  <TechNotifications />
                </ProtectedRoute>
              }
            />


            <Route
              path="*"
              element={
                <Navigate
                  to="/login"
                  replace
                />
              }
            />

          </Routes>

        </Router>

      </AuthProvider>

    </ThemeProvider>

  );
}