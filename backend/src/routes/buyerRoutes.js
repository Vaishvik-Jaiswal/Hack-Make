const express = require('express');
const buyerController = require('../controllers/buyerController');

const router = express.Router();

// Save buyer onboarding details
router.post('/profile', buyerController.saveProfile);

module.exports = router;