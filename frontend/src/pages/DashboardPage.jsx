import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

export const DashboardPage = ({ seller, onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!seller) {
      window.location.href = '/';
    }
  }, [seller]);

  if (!seller) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <h1>ODOP Marketplace</h1>
          <span className="nav-title">Seller Dashboard</span>
        </div>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, {seller.artisan_name || 'Seller'}!</h2>
          <p>Your shop: <strong>{seller.shop_name}</strong></p>
        </div>

        <div className="profile-section">
          <h3>Profile Information</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Phone Number</label>
              <p>+91 {seller.phone}</p>
            </div>
            <div className="profile-item">
              <label>Shop Name</label>
              <p>{seller.shop_name}</p>
            </div>
            <div className="profile-item">
              <label>Artisan Name</label>
              <p>{seller.artisan_name}</p>
            </div>
            <div className="profile-item">
              <label>District</label>
              <p>{seller.district}</p>
            </div>
            <div className="profile-item">
              <label>Udyam Number</label>
              <p>{seller.udyam_number}</p>
            </div>
            <div className="profile-item">
              <label>Profile Status</label>
              <p className="status-complete">✓ Complete</p>
            </div>
          </div>
        </div>

        <div className="actions-section">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button 
              className="action-btn upload-btn"
              onClick={() => navigate('/seller/upload-product')}
            >
              Upload Products
            </button>
            <button className="action-btn">View Orders</button>
            <button className="action-btn">Manage Inventory</button>
            <button className="action-btn">View Analytics</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
