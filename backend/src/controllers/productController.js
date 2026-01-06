const pool = require('../config/database');
const path = require('path');

// Upload product with image
exports.uploadProduct = async (req, res) => {
  try {
    const { vendor_id, name, description, price, category } = req.body;

    // Validate required fields
    if (!vendor_id || !name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: vendor_id, name, price, category',
      });
    }

    // Validate price is a positive number
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number',
      });
    }

    // Get image path from uploaded file
    let imagePath = null;
    if (req.file) {
      // Store relative path for serving from static folder
      imagePath = `/uploads/${req.file.filename}`;
    }

    const connection = await pool.getConnection();
    try {
      // Insert product into database
      const [result] = await connection.execute(
        `INSERT INTO products (vendor_id, name, description, price, category, image_path, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [vendor_id, name.trim(), description || null, parseFloat(price), category.trim(), imagePath]
      );

      res.status(201).json({
        success: true,
        message: 'Product uploaded successfully',
        data: {
          product: {
            id: result.insertId,
            vendor_id: vendor_id,
            name: name.trim(),
            description: description || null,
            price: parseFloat(price),
            category: category.trim(),
            image_path: imagePath,
            created_at: new Date()
          }
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Upload Product Error:', error);
    
    // Delete uploaded file if database insert fails
    if (req.file) {
      const fs = require('fs');
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Failed to delete file:', err);
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get products by vendor
exports.getVendorProducts = async (req, res) => {
  try {
    const { vendor_id } = req.params;

    if (!vendor_id) {
      return res.status(400).json({
        success: false,
        message: 'vendor_id is required',
      });
    }

    const connection = await pool.getConnection();
    try {
      const [products] = await connection.execute(
        'SELECT id, vendor_id, name, description, price, category, image_path, created_at FROM products WHERE vendor_id = ? ORDER BY created_at DESC',
        [vendor_id]
      );

      res.status(200).json({
        success: true,
        data: {
          products: products,
          total: products.length,
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { product_id } = req.params;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'product_id is required',
      });
    }

    const connection = await pool.getConnection();
    try {
      const [products] = await connection.execute(
        'SELECT id, vendor_id, name, description, price, category, image_path, created_at FROM products WHERE id = ?',
        [product_id]
      );

      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          product: products[0]
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get all products (with pagination)
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const category = req.query.category || null;

    const connection = await pool.getConnection();
    try {
      let query = 'SELECT id, name, description, category, base_district, created_at FROM products';
      let params = [];

      if (category) {
        query += ' WHERE category = ?';
        params.push(category);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [products] = await connection.execute(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM products';
      let countParams = [];

      if (category) {
        countQuery += ' WHERE category = ?';
        countParams.push(category);
      }

      const [countResult] = await connection.execute(countQuery, countParams);
      const total = countResult[0].total;

      res.status(200).json({
        success: true,
        data: {
          products: products,
          pagination: {
            current_page: page,
            per_page: limit,
            total: total,
            total_pages: Math.ceil(total / limit)
          }
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get All Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get product details and sellers in the district
exports.getProductSellers = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const connection = await pool.getConnection();
    try {
      // Get product details
      const [products] = await connection.execute(
        'SELECT id, name, description, category, base_district FROM products WHERE id = ?',
        [id]
      );

      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      const product = products[0];

      // Get sellers in the same district with their prices and stock
      const [sellers] = await connection.execute(
        `SELECT s.id, s.name, s.district_name, s.rating, ps.price, ps.stock
         FROM sellers s
         JOIN product_sellers ps ON s.id = ps.seller_id
         WHERE ps.product_id = ? AND s.district_name = ?`,
        [id, product.base_district]
      );

      res.status(200).json({
        success: true,
        data: {
          product,
          sellers,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get Product Sellers Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product sellers. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { vendor_id } = req.body;

    if (!product_id || !vendor_id) {
      return res.status(400).json({
        success: false,
        message: 'product_id and vendor_id are required',
      });
    }

    const connection = await pool.getConnection();
    try {
      // Check if product exists and belongs to vendor
      const [products] = await connection.execute(
        'SELECT image_path FROM products WHERE id = ? AND vendor_id = ?',
        [product_id, vendor_id]
      );

      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product not found or does not belong to this vendor',
        });
      }

      // Delete image file if exists
      if (products[0].image_path) {
        const fs = require('fs');
        const filePath = path.join(__dirname, '../../uploads', path.basename(products[0].image_path));
        fs.unlink(filePath, (err) => {
          if (err) console.error('Failed to delete image file:', err);
        });
      }

      // Delete product from database
      await connection.execute('DELETE FROM products WHERE id = ?', [product_id]);

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = exports;
