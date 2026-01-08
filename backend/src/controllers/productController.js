const pool = require('../config/database');
const path = require('path');

async function ensureColumns(connection) {
  try {
    // Try a quick select that uses the columns
    await connection.query('SELECT in_stock, quantity FROM products LIMIT 1');
  } catch (err) {
    // If column missing, add them safely
    if (err && err.code === 'ER_BAD_FIELD_ERROR') {
      await connection.execute('ALTER TABLE products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN NOT NULL DEFAULT true');
      await connection.execute('ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity INT NOT NULL DEFAULT 0');
    } else {
      throw err;
    }
  }
}

// Upload product with image
const uploadProduct = async (req, res) => {
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
            created_at: new Date(),
            in_stock: true,
            quantity: 0
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
const getVendorProducts = async (req, res) => {
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
      // Ensure in_stock and quantity exist (safeguard for older DBs)
      // await ensureColumns(connection);

      const [products] = await connection.execute(
        'SELECT id, vendor_id, name, description, price, category, image_path, in_stock, quantity, created_at FROM products WHERE vendor_id = ? ORDER BY created_at DESC',
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
const getProductById = async (req, res) => {
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
      //await ensureColumns(connection);

      const [products] = await connection.execute(
        'SELECT id, vendor_id, name, description, price, category, image_path, in_stock, quantity, created_at FROM products WHERE id = ?',
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
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const category = req.query.category || null;

    const connection = await pool.getConnection();
    try {
      //await ensureColumns(connection);

      let query = 'SELECT id, vendor_id, name, description, price, category, image_path, in_stock, quantity, created_at FROM products';
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

// Update product (price/description)
const updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { vendor_id } = req.body;

    if (!product_id || !vendor_id) {
      return res.status(400).json({ success: false, message: 'Missing IDs' });
    }

    const price =
      req.body.price !== undefined && req.body.price !== ''
        ? Number(req.body.price)
        : null;

    const quantity =
      req.body.quantity !== undefined
        ? parseInt(req.body.quantity, 10)
        : null;

    const description =
      req.body.description !== undefined ? req.body.description : null;

    const in_stock =
      quantity !== null ? (quantity > 0 ? 1 : 0) : req.body.in_stock ? 1 : 0;

    const connection = await pool.getConnection();
    try {
      const [own] = await connection.execute(
        'SELECT id FROM products WHERE id = ? AND vendor_id = ?',
        [product_id, vendor_id]
      );

      if (own.length === 0) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      await connection.execute(
        `UPDATE products
         SET price = COALESCE(?, price),
             description = COALESCE(?, description),
             quantity = COALESCE(?, quantity),
             in_stock = COALESCE(?, in_stock)
         WHERE id = ? AND vendor_id = ?`,
        [
          price,
          description,
          quantity,
          in_stock,
          product_id,
          vendor_id
        ]
      );

      const [updated] = await connection.execute(
        'SELECT * FROM products WHERE id = ?',
        [product_id]
      );

      res.json({ success: true, data: { product: updated[0] } });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Update Product Error:', err);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};



// Toggle availability
const toggleAvailability = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { vendor_id } = req.body;

    if (!product_id || !vendor_id) {
      return res.status(400).json({ success: false, message: 'product_id and vendor_id are required' });
    }

    const connection = await pool.getConnection();
    try {
      // Ensure columns exist
      //await ensureColumns(connection);

      // Verify ownership
      const [rows] = await connection.execute('SELECT in_stock, quantity FROM products WHERE id = ? AND vendor_id = ?', [product_id, vendor_id]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Product not found or does not belong to this vendor' });

      // Toggle
      await connection.execute('UPDATE products SET in_stock = NOT in_stock WHERE id = ? AND vendor_id = ?', [product_id, vendor_id]);

      const [updated] = await connection.execute('SELECT id, vendor_id, name, description, price, category, image_path, in_stock, quantity, created_at FROM products WHERE id = ?', [product_id]);

      res.status(200).json({ success: true, data: { product: updated[0] } });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Toggle Availability Error:', error);
    res.status(500).json({ success: false, message: 'Error toggling availability', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// Delete product
// Delete product (FIXED)
const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const vendor_id = req.query.vendor_id; // ✅ FIX

    if (!product_id || !vendor_id) {
      return res.status(400).json({
        success: false,
        message: 'product_id and vendor_id are required',
      });
    }

    const connection = await pool.getConnection();
    try {
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

      // delete image
      if (products[0].image_path) {
        const fs = require('fs');
        const filePath = path.join(
          __dirname,
          '../../uploads',
          path.basename(products[0].image_path)
        );
        fs.unlink(filePath, () => {});
      }

      await connection.execute(
        'DELETE FROM products WHERE id = ? AND vendor_id = ?',
        [product_id, vendor_id]
      );

      res.status(200).json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting product' });
  }
};


// Adjust quantity (increment/decrement)
const adjustQuantity = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { vendor_id, delta } = req.body;

    if (!product_id || vendor_id === undefined || delta === undefined) {
      return res.status(400).json({ success: false, message: 'product_id, vendor_id and delta are required' });
    }

    const connection = await pool.getConnection();
    try {
      //await ensureColumns(connection);

      const [rows] = await connection.execute('SELECT quantity FROM products WHERE id = ? AND vendor_id = ?', [product_id, vendor_id]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Product not found or does not belong to this vendor' });

      // Use GREATEST to prevent negative quantity
      await connection.execute('UPDATE products SET quantity = GREATEST(0, quantity + ?) WHERE id = ? AND vendor_id = ?', [parseInt(delta, 10), product_id, vendor_id]);

      const [updated] = await connection.execute('SELECT id, vendor_id, name, description, price, category, image_path, in_stock, quantity, created_at FROM products WHERE id = ?', [product_id]);

      res.status(200).json({ success: true, data: { product: updated[0] } });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Adjust Quantity Error:', error);
    res.status(500).json({ success: false, message: 'Error adjusting quantity', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

module.exports = {
  uploadProduct,
  getVendorProducts,
  getProductById,
  getAllProducts,
  updateProduct,
  toggleAvailability,
  deleteProduct,
  adjustQuantity,
};

