import { useState, useEffect } from 'react';

// Custom hook for managing auth state
export const useAuth = () => {
  const [seller, setSeller] = useState(() => {
    const savedSeller = localStorage.getItem('seller');
    return savedSeller ? JSON.parse(savedSeller) : null;
  });

  const setSeller_ = (sellerData) => {
    setSeller(sellerData);
    if (sellerData) {
      localStorage.setItem('seller', JSON.stringify(sellerData));
    } else {
      localStorage.removeItem('seller');
    }
  };

  const logout = () => {
    setSeller_(null);
  };

  return {
    seller,
    setSeller: setSeller_,
    logout,
    isAuthenticated: !!seller,
  };
};

export default useAuth;
