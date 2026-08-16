import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

import '../../styles/auth.css';
import '../../styles/global.css';


export default function ForgotPassword() {

  // 1 = Email
  // 2 = Reset password
  // 3 = Success
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  // Step 1: Send email
  const sendResetToken = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError('');

    try {

      const response = await api.post(
        '/auth/forgot-password',
        { email }
      );

      setMessage(response.data.message);

      // Development purpose
      if (response.data.resetToken) {
        setToken(response.data.resetToken);
      }

      // Go to step 2
      setStep(2);

    } catch (error) {

      setError(
        error.response?.data?.message ||
        'Failed to send reset token'
      );

    } finally {

      setLoading(false);

    }
  };


  // Step 2: Reset password
  const resetPassword = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError('');

    try {

      const response = await api.put(
        `/auth/reset-password/${token}`,
        {
          password: password
        }
      );

      setMessage(response.data.message);

      // Go to success page
      setStep(3);

    } catch (error) {

      setError(
        error.response?.data?.message ||
        'Password reset failed'
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-header">

          <div className="auth-logo">
            <span>CS</span>
          </div>

          <h1>Password Recovery</h1>

          <p>Reset your account password</p>

        </div>


        <div className="auth-card">


          {/* STEP 1 */}

          {step === 1 && (

            <form onSubmit={sendResetToken}>

              <h3>Forgot Password?</h3>

              <p>
                Enter your email to receive a reset token.
              </p>

              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}


              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />


              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? 'Sending...'
                  : 'Send Reset Token'}
              </button>

            </form>

          )}


          {/* STEP 2 */}

          {step === 2 && (

            <form onSubmit={resetPassword}>

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


              <label>Reset Token</label>

              <input
                type="text"
                className="form-input"
                value={token}
                onChange={(e) =>
                  setToken(e.target.value)
                }
                placeholder="Enter reset token"
                required
              />


              <label>New Password</label>

              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                minLength={6}
              />


              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? 'Resetting...'
                  : 'Reset Password'}
              </button>

            </form>

          )}


          {/* STEP 3 */}

          {step === 3 && (

            <div>

              <div className="alert alert-success">
                {message}
              </div>

              <Link
                to="/login"
                className="btn btn-primary"
              >
                Back to Login
              </Link>

            </div>

          )}


          <div className="auth-footer">

            <Link to="/login">
              ← Back to Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}