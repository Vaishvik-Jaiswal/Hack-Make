const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Send OTP to phone number
router.post('/send-otp', authController.sendOTP);

// Verify OTP (just validate, don't create user)
router.post('/verify-otp', authController.verifyOTP);

// Login as buyer or seller after role selection
router.post('/login', authController.loginAsRole);

module.exports = router;
