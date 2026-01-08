

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Store } from 'lucide-react';
import './RoleSelection.css';

export const RoleSelection = ({ phone, onRoleSelect, onBackToLogin }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    // Debug log to help verify runtime behavior
    console.log('RoleSelection: Back to Login clicked, onBackToLogin=', onBackToLogin);
    if (typeof onBackToLogin === 'function') {
      onBackToLogin();
    } else {
      // fallback navigation if parent didn't provide handler
      navigate('/');
    }
  };

  const handleRoleSelect = async (role) => {
    setLoading(true);
    try {
      await onRoleSelect(role);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-card">

        {/* LEFT PANEL */}
        <div className="role-selection-left">
          <h1>Government of Madhya Pradesh</h1>
          <p>
            One District One Product (ODOP) Marketplace empowers local artisans
            and buyers across Madhya Pradesh.
          </p>
          <ul>
            <li>✔ Authentic district products</li>
            <li>✔ Secure & trusted platform</li>
            <li>✔ Government-backed initiative</li>
          </ul>
        </div>

        {/* RIGHT PANEL */}
        <div className="role-selection-right">
          <h2>ODOP Marketplace</h2>
          <p className="subtitle">Choose your role to continue</p>
          <p className="subtitle">+91 {phone}</p>

          <div className="role-buttons">
            <button
              onClick={() => handleRoleSelect('buyer')}
              className="role-btn buyer-btn"
              disabled={loading}
            >
              <ShoppingBag size={18} />
              {loading ? 'Loading...' : 'Continue as Buyer'}
            </button>

            <button
              onClick={() => handleRoleSelect('seller')}
              className="role-btn seller-btn"
              disabled={loading}
            >
              <Store size={18} />
              {loading ? 'Loading...' : 'Continue as Seller'}
            </button>
          </div>

          <p className="info-text">
            Select your role to proceed to the marketplace.
          </p>

          <div className="mt-3">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleBack}
              type="button"
            >
              Back to Login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RoleSelection;
