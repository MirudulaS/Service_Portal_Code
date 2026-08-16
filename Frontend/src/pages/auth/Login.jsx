import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

import '../../styles/auth.css';
import '../../styles/global.css';


export default function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();


  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  // Handle input changes
  const handleChange = (e) => {

    setError('');

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  // Handle login
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setLoading(true);

    try {

      // Call login function
      const user = await login(
        formData.email,
        formData.password
      );


      // Redirect based on role

      if (user.role === 'admin') {

        navigate('/admin/dashboard');

      } else if (user.role === 'technician') {

        navigate('/technician/dashboard');

      } else {

        navigate('/user/dashboard');

      }

    } catch (error) {

      setError(
        error.response?.data?.message ||
        'Invalid email or password'
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="auth-page">


      {/* Theme button */}

      <button
        className="theme-btn"
        onClick={toggleTheme}
      >
        {theme === 'light'
          ? 'Dark Mode'
          : 'Light Mode'}
      </button>


      <div className="auth-container">


        {/* Header */}

        <div className="auth-header">

          <div className="auth-logo">
            <span>CS</span>
          </div>

          <h1>College Service Portal</h1>

          <p>Service Management System</p>

        </div>


        {/* Login card */}

        <div className="auth-card">

          <h2>Sign in to your account</h2>


          {/* Error message */}

          {error && (

            <div className="alert alert-error">
              {error}
            </div>

          )}


          <form onSubmit={handleSubmit}>


            {/* Email */}

            <div className="form-group">

              <label>Email Address</label>

              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="you@college.edu"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />

            </div>


            {/* Password */}

            <div className="form-group">

              <label>Password</label>

              <div className="password-wrapper">

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword
                    ? 'Hide'
                    : 'Show'}
                </button>

              </div>

            </div>


            {/* Forgot password */}

            <div style={{ textAlign: 'right' }}>

              <Link to="/forgot-password">
                Forgot password?
              </Link>

            </div>


            {/* Login button */}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >

              {loading
                ? 'Signing in...'
                : 'Sign In'}

            </button>

          </form>


          {/* Register */}

          <div className="auth-footer">

            Don't have an account?

            <Link to="/register">
              Register here
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}