const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Send OTP to phone number
router.post('/send-otp', authController.sendOTP);

// Verify OTP and authenticate user
router.post('/verify-otp', authController.verifyOTP);

module.exports = router;
