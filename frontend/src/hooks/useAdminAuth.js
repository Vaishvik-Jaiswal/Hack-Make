import { useState, useEffect } from 'react';
import { adminAuthService } from '../services/adminAuthService';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticated = adminAuthService.isAuthenticated();
    const email = adminAuthService.getAdminEmail();
    setIsAuthenticated(authenticated);
    setAdminEmail(email || '');
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await adminAuthService.login(email, password);
      setIsAuthenticated(true);
      setAdminEmail(result.email);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    adminAuthService.logout();
    setIsAuthenticated(false);
    setAdminEmail('');
  };

  return {
    isAuthenticated,
    adminEmail,
    loading,
    login,
    logout,
  };
};
