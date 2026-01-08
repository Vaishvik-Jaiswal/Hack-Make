import React, { useState, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import OnboardingComponent from './components/OnboardingComponent';
import DashboardPage from './pages/DashboardPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import UploadProductComponent from './components/UploadProductComponent';
import AdminDashboard from './pages/AdminDashboard';
import AdminBot from './pages/AdminBot';
import RoleSelection from './components/RoleSelection';
import './App.css';

const ManageInventory = React.lazy(() => import('./components/ManageInventoryComponent'));

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  // Top-level hooks
  const [seller, setSeller] = useState(() => {
    const saved = localStorage.getItem('seller');
    return saved ? JSON.parse(saved) : null;
  });
  const [buyer, setBuyer] = useState(() => {
    const saved = localStorage.getItem('buyer');
    return saved ? JSON.parse(saved) : null;
  });
  const [phoneVerified, setPhoneVerified] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const handleProfileComplete = (updatedSeller) => {
    setSeller(updatedSeller);
    localStorage.setItem('seller', JSON.stringify(updatedSeller));
  };

  const handleBuyerProfileComplete = (updatedBuyer) => {
    setBuyer(updatedBuyer);
    localStorage.setItem('buyer', JSON.stringify(updatedBuyer));
  };

  const handleSellerProfileComplete = (updatedSeller) => {
    setSeller(updatedSeller);
    localStorage.setItem('seller', JSON.stringify(updatedSeller));
  };

  const handleLogout = () => {
    setSeller(null);
    setBuyer(null);
    setPhoneVerified(null);
    setUserRole(null);
    localStorage.removeItem('buyer');
    localStorage.removeItem('seller');
    // Ensure the UI navigates back to the login/root route immediately
    try {
      navigate('/', { replace: true });
    } catch (err) {
      // fallback: in case navigate isn't available for any reason
      window.location.pathname = '/';
    }
  };

  const handleOtpVerified = (phone) => {
    setPhoneVerified(phone);
  };

  const handleRoleSelect = async (role) => {
    setUserRole(role);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneVerified,
          role: role,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const result = await response.json();
      const user = result.data.user;

      if (role === 'buyer') {
        setBuyer(user);
        localStorage.setItem('buyer', JSON.stringify(user));
      } else {
        setSeller(user);
        localStorage.setItem('seller', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in. Please try again.');
    }
  };

  const handleBackToLogin = () => {
  // Fully reset session so App will render the LoginComponent again
  setSeller(null);
  setBuyer(null);
    setPhoneVerified(null);
    setUserRole(null);
  localStorage.removeItem('buyer');
  localStorage.removeItem('seller');
    try {
      navigate('/', { replace: true });
    } catch (err) {
      window.location.pathname = '/';
    }
  };

  // Admin Dashboard Route - Accessible independently
  const currentPath = location.pathname;
  if (currentPath.startsWith('/admin')) {
    return (
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/bot" element={<AdminBot />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    );
  }

  // SELLER PORTAL: If not logged in
  if (!seller && !buyer) {
    if (!phoneVerified) {
      // Show phone/OTP screen
      return (
        <Routes>
          <Route
            path="/"
            element={<LoginComponent onOtpVerified={handleOtpVerified} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      );
    } else {
      // Show role selection after OTP
      return (
        <Routes>
          <Route
            path="/"
            element={
              <RoleSelection
                phone={phoneVerified}
                onRoleSelect={handleRoleSelect}
                onBackToLogin={handleBackToLogin}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      );
    }
  }

  // Role not selected
  if (!userRole) {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <RoleSelection
              phone={phoneVerified}
              onRoleSelect={handleRoleSelect}
              onBackToLogin={handleBackToLogin}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // Buyer logic
  if (userRole === 'buyer') {
    if (!buyer || !buyer.phone) {
      return (
        <Routes>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      );
    }

    if (!buyer.is_profile_complete) {
      return (
        <Routes>
          <Route
            path="/onboarding"
            element={
              <OnboardingComponent
                buyer={buyer}
                onProfileComplete={handleBuyerProfileComplete}
              />
            }
          />
          <Route path="*" element={<Navigate to="/onboarding" />} />
        </Routes>
      );
    }

    return (
      <Routes>
        <Route
          path="/dashboard"
          element={<DashboardPage buyer={buyer} onLogout={handleLogout} />}
        />
        <Route
          path="/product/:id"
          element={<ProductDetailPage buyer={buyer} />}
        />
        <Route
          path="/cart"
          element={<CartPage buyer={buyer} />}
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    );
  }

  // Seller logic
  if (userRole === 'seller') {
    if (!seller || !seller.phone) {
      return (
        <Routes>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      );
    }

    if (!seller.is_profile_complete) {
      return (
        <Routes>
          <Route
            path="/seller/onboarding"
            element={
              <OnboardingComponent
                seller={seller}
                onProfileComplete={handleSellerProfileComplete}
              />
            }
          />
          <Route path="*" element={<Navigate to="/seller/onboarding" />} />
        </Routes>
      );
    }

    return (
      <Suspense fallback={<div className="p-6">Loading…</div>}>
        <Routes>
          <Route
            path="/seller/dashboard"
            element={<DashboardPage seller={seller} onLogout={handleLogout} />}
          />
          <Route
            path="/seller/upload-product"
            element={<UploadProductComponent seller={seller} onLogout={handleLogout} />}
          />
          <Route
            path="/seller/manage-inventory"
            element={<ManageInventory seller={seller} />}
          />
          <Route path="*" element={<Navigate to="/seller/dashboard" />} />
        </Routes>
      </Suspense>
    );
  }

  // Default fallback
  return <div>Unknown state</div>;
}

export default App;
