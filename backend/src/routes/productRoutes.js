const express = require('express');
const productController = require('../controllers/productController');
const upload = require('../config/multer');

const router = express.Router();

// Upload product with image - must come before other POST routes
router.post('/', upload.single('image'), productController.uploadProduct);

// Named routes must come before ID-based routes
router.get('/vendor/:vendor_id', productController.getVendorProducts);

// Get all products (with pagination and filtering) - must come before /:product_id
router.get('/', productController.getAllProducts);

// Get product by ID - must come last
router.get('/:product_id', productController.getProductById);

// Delete product
router.delete('/:product_id', productController.deleteProduct);

module.exports = router;
