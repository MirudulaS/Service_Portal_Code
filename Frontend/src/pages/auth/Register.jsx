import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

import '../../styles/auth.css';
import '../../styles/global.css';


export default function Register() {

  const navigate = useNavigate();
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    hostel: '',
    phone: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  // Update form values
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  // Register user
  const handleSubmit = async (e) => {

    e.preventDefault();
    setError('');

    // Check password
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {

      // Remove confirmPassword
      const { confirmPassword, ...userData } = form;

      // Register
      await register(userData);

      // Go to dashboard
      navigate('/user/dashboard');

    } catch (error) {

      setError(
        error.response?.data?.message ||
        'Registration failed'
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="auth-page">

      {/* Theme */}
      <button
        className="theme-btn"
        onClick={toggleTheme}
      >
        {theme === 'light'
          ? 'Dark Mode'
          : 'Light Mode'}
      </button>


      <div className="auth-container">

        <div className="auth-header">

          <div className="auth-logo">
            <span>CS</span>
          </div>

          <h1>Create Account</h1>
          <p>Register as Student or Staff</p>

        </div>


        <div className="auth-card">

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="form-group">

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                className="form-input"
                value={form.name}
                onChange={handleChange}
                required
              />

            </div>


            {/* Email */}
            <div className="form-group">

              <label>Email Address</label>

              <input
                type="email"
                name="email"
                className="form-input"
                value={form.email}
                onChange={handleChange}
                required
              />

            </div>


            {/* Department */}
            <div className="form-group">

              <label>Department</label>

              <select
                name="department"
                className="form-select"
                value={form.department}
                onChange={handleChange}
              >

                <option value="">Select Department</option>
                <option>Computer Science</option>
                <option>Electronics</option>
                <option>Mechanical</option>
                <option>Civil</option>
                <option>Arts & Science</option>
                <option>Management</option>
                <option>Staff</option>

              </select>

            </div>


            {/* Hostel */}
            <div className="form-group">

              <label>Hostel / Block</label>

              <input
                type="text"
                name="hostel"
                className="form-input"
                value={form.hostel}
                onChange={handleChange}
              />

            </div>


            {/* Phone */}
            <div className="form-group">

              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                className="form-input"
                value={form.phone}
                onChange={handleChange}
              />

            </div>


            {/* Password */}
            <div className="form-group">

              <label>Password</label>

              <input
                type="password"
                name="password"
                className="form-input"
                value={form.password}
                onChange={handleChange}
                required
              />

            </div>


            {/* Confirm Password */}
            <div className="form-group">

              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />

            </div>


            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? 'Creating Account...'
                : 'Create Account'}
            </button>

          </form>


          <div className="auth-footer">

            Already have an account?

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}