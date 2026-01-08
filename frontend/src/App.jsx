import React, { useState, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import OnboardingComponent from './components/OnboardingComponent';
import DashboardPage from './pages/DashboardPage';
import UploadProductComponent from './components/UploadProductComponent';
import AdminDashboard from './pages/AdminDashboard';
import AdminBot from './pages/AdminBot';
import './App.css';

const ManageInventory = React.lazy(() => import('./components/ManageInventoryComponent'));

function App() {
  const [seller, setSeller] = useState(() => {
    const saved = localStorage.getItem('seller');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (sellerData) => {
    setSeller(sellerData);
    localStorage.setItem('seller', JSON.stringify(sellerData));
  };

  const handleProfileComplete = (updatedSeller) => {
    setSeller(updatedSeller);
    localStorage.setItem('seller', JSON.stringify(updatedSeller));
  };

  const handleLogout = () => {
    setSeller(null);
    localStorage.removeItem('seller');
  };

  // Admin Dashboard Route - Accessible independently
  // Check if trying to access admin route
  const currentPath = window.location.pathname;
  if (currentPath.startsWith('/admin')) {
    return (
      <Router>
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/bot" element={<AdminBot />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </Router>
    );
  }

  // Route logic based on seller state (SELLER PORTAL)
  if (!seller) {
    return (
      <Routes>
        <Route
          path="/"
          element={<LoginComponent onLoginSuccess={handleLoginSuccess} />}
        />
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
              onProfileComplete={handleProfileComplete}
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

export default App;