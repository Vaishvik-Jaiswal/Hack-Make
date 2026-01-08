import React, { useState, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import OnboardingComponent from './components/OnboardingComponent';
import DashboardPage from './pages/DashboardPage';
import UploadProductComponent from './components/UploadProductComponent';
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

  // Route logic based on seller state
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