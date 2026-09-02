import { useState } from "react";
import UserLayout from "../../components/layout/UserLayout";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/global.css";
import "../../styles/dashboard.css";

export default function UserProfile() {

  // Get current user and function to update user
  const { user, updateUser } = useAuth();


  // Profile form
  const [form, setForm] = useState({
    name: user?.name || "",
    department: user?.department || "",
    hostel: user?.hostel || "",
    phone: user?.phone || ""
  });


  // Password form
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: ""
  });


  // Profile saving status
  const [saving, setSaving] = useState(false);

  // Password saving status
  const [savingPassword, setSavingPassword] = useState(false);


  // Profile messages
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // Password messages
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");


  // Create user initials
  const initials = user?.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);


  // Update profile
  const handleProfileSave = async (event) => {

    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");


    try {

      // Send updated profile to backend
      const response = await api.put(
        "/auth/profile",
        form
      );


      // Update user information in AuthContext
      updateUser(response.data);


      // Show success message
      setMessage(
        "Profile updated successfully!"
      );


    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Update failed"
      );


    } finally {

      setSaving(false);

    }

  };


  // Change password
  const handlePasswordSave = async (event) => {

    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");


    // Check whether passwords match
    if (
      passwordForm.password !==
      passwordForm.confirmPassword
    ) {

      setPasswordError(
        "Passwords do not match"
      );

      return;
    }


    // Check minimum password length
    if (passwordForm.password.length < 6) {

      setPasswordError(
        "Password must be at least 6 characters"
      );

      return;
    }


    setSavingPassword(true);


    try {

      // Send new password to backend
      await api.put(
        "/auth/profile",
        {
          password: passwordForm.password
        }
      );


      // Show success message
      setPasswordMessage(
        "Password changed successfully!"
      );


      // Clear password fields
      setPasswordForm({
        password: "",
        confirmPassword: ""
      });


    } catch (error) {

      setPasswordError(
        error.response?.data?.message ||
        "Password change failed"
      );


    } finally {

      setSavingPassword(false);

    }

  };


  return (

    <UserLayout
      pageTitle="My Profile"
      pageSubtitle="View and update your account details"
    >

      <div
        style={{
          maxWidth: "560px",
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}
      >


        {/* Profile information */}

        <div className="profile-card">

          <div className="profile-header">

            <div className="profile-avatar">
              {initials}
            </div>

            <div>

              <h2>
                {user?.name}
              </h2>

              <p>
                {user?.email}
              </p>

              <span className="badge badge-assigned">

                {user?.role}

              </span>

            </div>

          </div>


          {/* Profile messages */}

          {message && (

            <div className="alert alert-success">
              {message}
            </div>

          )}

          {error && (

            <div className="alert alert-error">
              {error}
            </div>

          )}


          {/* Profile form */}

          <form onSubmit={handleProfileSave}>


            {/* Name */}

            <div className="form-group">

              <label className="form-label">
                Full Name
              </label>

              <input
                className="form-input"
                value={form.name}
                onChange={(event) => {

                  setForm({
                    ...form,
                    name: event.target.value
                  });

                }}
                required
              />

            </div>


            {/* Department */}

            <div className="form-group">

              <label className="form-label">
                Department
              </label>

              <select
                className="form-select"
                value={form.department}
                onChange={(event) => {

                  setForm({
                    ...form,
                    department: event.target.value
                  });

                }}
              >

                <option value="">
                  Select
                </option>

                <option>
                  Computer Science
                </option>

                <option>
                  Electronics
                </option>

                <option>
                  Mechanical
                </option>

                <option>
                  Civil
                </option>

                <option>
                  Arts & Science
                </option>

                <option>
                  Management
                </option>

                <option>
                  Staff
                </option>

              </select>

            </div>


            {/* Hostel */}

            <div className="form-group">

              <label className="form-label">
                Hostel / Block
              </label>

              <input
                className="form-input"
                value={form.hostel}
                onChange={(event) => {

                  setForm({
                    ...form,
                    hostel: event.target.value
                  });

                }}
                placeholder="e.g. Block A, Room 205"
              />

            </div>


            {/* Phone */}

            <div className="form-group">

              <label className="form-label">
                Phone Number
              </label>

              <input
                className="form-input"
                value={form.phone}
                onChange={(event) => {

                  setForm({
                    ...form,
                    phone: event.target.value
                  });

                }}
                placeholder="+91 98765 43210"
              />

            </div>


            {/* Email */}

            <div className="form-group">

              <label className="form-label">
                Email Address
              </label>

              <input
                className="form-input"
                value={user?.email}
                readOnly
              />

            </div>


            {/* Save profile */}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : "Save Changes"}

            </button>

          </form>

        </div>


        {/* Change password */}

        <div className="card">

          <h3>
            Change Password
          </h3>


          {passwordMessage && (

            <div className="alert alert-success">
              {passwordMessage}
            </div>

          )}


          {passwordError && (

            <div className="alert alert-error">
              {passwordError}
            </div>

          )}


          <form onSubmit={handlePasswordSave}>


            {/* New password */}

            <div className="form-group">

              <label className="form-label">
                New Password
              </label>

              <input
                type="password"
                className="form-input"
                value={passwordForm.password}
                onChange={(event) => {

                  setPasswordForm({
                    ...passwordForm,
                    password: event.target.value
                  });

                }}
                placeholder="Minimum 6 characters"
                required
              />

            </div>


            {/* Confirm password */}

            <div className="form-group">

              <label className="form-label">
                Confirm New Password
              </label>

              <input
                type="password"
                className="form-input"
                value={passwordForm.confirmPassword}
                onChange={(event) => {

                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword:
                      event.target.value
                  });

                }}
                placeholder="Repeat new password"
                required
              />

            </div>


            {/* Update password */}

            <button
              type="submit"
              className="btn btn-secondary"
              disabled={savingPassword}
            >

              {savingPassword
                ? "Updating..."
                : "Update Password"}

            </button>

          </form>

        </div>

      </div>

    </UserLayout>

  );
}