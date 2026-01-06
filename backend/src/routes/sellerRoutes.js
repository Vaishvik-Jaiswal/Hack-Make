const express = require('express');
const sellerController = require('../controllers/sellerController');
const productController = require('../controllers/productController');

const router = express.Router();

// Update seller profile
router.put('/:sellerId/profile', sellerController.updateProfile);

// Get seller profile
router.get('/:sellerId/profile', sellerController.getProfile);

// Export readiness for seller's latest product
router.get('/export-readiness/:sellerId', productController.getExportReadiness);

module.exports = router;
