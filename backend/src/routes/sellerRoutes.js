const express = require('express');
const sellerController = require('../controllers/sellerController');

const router = express.Router();

// Create seller profile
router.post('/profile', sellerController.createProfile);

// Update seller profile
router.put('/:sellerId/profile', sellerController.updateProfile);

// Get seller profile
router.get('/:sellerId/profile', sellerController.getProfile);

module.exports = router;
