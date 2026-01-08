// Admin authentication service for Government Dashboard
export const adminAuthService = {
  login: async (email, password) => {
    // Validate email format and domain
    if (!email.endsWith('@mpgov.in')) {
      throw new Error('Email must be from @mpgov.in domain');
    }

    // Validate password
    if (password !== 'MPAdmin2026') {
      throw new Error('Invalid password');
    }

    // Store auth token in localStorage
    const token = btoa(`${email}:${password}`);
    localStorage.setItem('adminAuthToken', token);
    localStorage.setItem('adminEmail', email);
    localStorage.setItem('adminLoginTime', new Date().toISOString());

    return {
      success: true,
      email,
      token,
    };
  },

  logout: () => {
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminLoginTime');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('adminAuthToken');
  },

  getAdminEmail: () => {
    return localStorage.getItem('adminEmail');
  },
};
