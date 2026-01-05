import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import OnboardingComponent from './components/OnboardingComponent';
import DashboardPage from './pages/DashboardPage';
import UploadProductComponent from './components/UploadProductComponent';
import './App.css';

function App() {
  const [seller, setSeller] = useState(() => {
    const saved = localStorage.getItem('seller');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

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
      <Router>
        <Routes>
          <Route
            path="/"
            element={<LoginComponent onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  if (!seller.is_profile_complete) {
    return (
      <Router>
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
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/seller/dashboard"
          element={<DashboardPage seller={seller} onLogout={handleLogout} />}
        />
        <Route
          path="/seller/upload-product"
          element={<UploadProductComponent seller={seller} onLogout={handleLogout} />}
        />
        <Route path="*" element={<Navigate to="/seller/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
