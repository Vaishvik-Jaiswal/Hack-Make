const pool = require('../config/database');
const { isValidShopName, isValidArtisanName, isValidUdyamNumber, isValidDistrict } = require('../utils/validators');

// Update seller profile
exports.updateProfile = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { shop_name, artisan_name, district, udyam_number } = req.body;

    // Validate required fields
    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: 'Seller ID is required.',
      });
    }

    if (!shop_name || !isValidShopName(shop_name)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid shop name. Must be between 3-100 characters.',
      });
    }

    if (!artisan_name || !isValidArtisanName(artisan_name)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid artisan name. Must be between 2-100 characters.',
      });
    }

    if (!district || !isValidDistrict(district)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid district. Please select a valid district from the list.',
      });
    }

    if (!udyam_number || !isValidUdyamNumber(udyam_number)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Udyam number format. Must be in format: UDxxxx0000000',
      });
    }

    const connection = await pool.getConnection();
    try {
      // Check if seller exists
      const [sellers] = await connection.execute(
        'SELECT id FROM sellers WHERE id = ?',
        [sellerId]
      );

      if (sellers.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Seller not found.',
        });
      }

      // Update seller profile
      await connection.execute(
        `UPDATE sellers 
         SET shop_name = ?, artisan_name = ?, district = ?, udyam_number = ?, is_profile_complete = true, updated_at = NOW()
         WHERE id = ?`,
        [shop_name.trim(), artisan_name.trim(), district, udyam_number.toUpperCase(), sellerId]
      );

      // Fetch updated seller data
      const [updatedSellers] = await connection.execute(
        'SELECT id, phone, shop_name, artisan_name, district, udyam_number, is_profile_complete FROM sellers WHERE id = ?',
        [sellerId]
      );

      const updatedSeller = updatedSellers[0];

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          seller: updatedSeller,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get seller profile
exports.getProfile = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: 'Seller ID is required.',
      });
    }

    const connection = await pool.getConnection();
    try {
      const [sellers] = await connection.execute(
        'SELECT id, phone, shop_name, artisan_name, district, udyam_number, is_profile_complete, created_at FROM sellers WHERE id = ?',
        [sellerId]
      );

      if (sellers.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Seller not found.',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          seller: sellers[0],
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = exports;
