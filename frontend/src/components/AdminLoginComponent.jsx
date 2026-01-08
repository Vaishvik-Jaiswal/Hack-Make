import { useState } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import './AdminLoginComponent.css';

const AdminLoginComponent = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1>Government Admin Dashboard</h1>
          <p>ODOP & GI Tags Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mpgov.in"
              required
              disabled={isLoading}
            />
            <small>Must be @mpgov.in email</small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={isLoading} className="admin-login-btn">
            {isLoading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p className="demo-credentials">
            <strong>Demo Credentials:</strong><br />
            Email: admin@mpgov.in<br />
            Password: MPAdmin2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginComponent;
