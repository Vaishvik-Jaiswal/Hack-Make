import api from './api';

// Send OTP to phone number
export const sendOTP = (phone) => {
  return api.post('/auth/send-otp', { phone });
};

// Verify OTP and authenticate user
export const verifyOTP = (phone, otp) => {
  return api.post('/auth/verify-otp', { phone, otp });
};

// Update seller profile
export const updateSellerProfile = (sellerId, profileData) => {
  return api.put(`/seller/${sellerId}/profile`, profileData);
};

// Get seller profile
export const getSellerProfile = (sellerId) => {
  return api.get(`/seller/${sellerId}/profile`);
};

export default {
  sendOTP,
  verifyOTP,
  updateSellerProfile,
  getSellerProfile,
};
