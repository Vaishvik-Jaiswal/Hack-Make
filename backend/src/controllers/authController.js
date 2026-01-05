const pool = require('../config/database');
const { generateOTP, sendSMS } = require('../utils/otp');
const { isValidPhone, isValidOTP } = require('../utils/validators');

const OTP_EXPIRY_MINUTES = process.env.OTP_EXPIRY_MINUTES || 5;

// Send OTP to phone number
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate phone number
    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number. Please provide a valid 10-digit Indian phone number.',
      });
    }

    // Clean phone number (remove any formatting)
    const cleanPhone = phone.replace(/\D/g, '');

    // Generate OTP
    const otp = generateOTP(6);

    // Send OTP via SMS (mocked)
    sendSMS(cleanPhone, otp);

    // Save OTP to database with expiry
    const expiryTime = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    
    const connection = await pool.getConnection();
    try {
      // Check if OTP already exists for this phone, if so delete it
      await connection.execute(
        'DELETE FROM otp_codes WHERE phone = ?',
        [cleanPhone]
      );

      // Insert new OTP
      await connection.execute(
        'INSERT INTO otp_codes (phone, code, created_at, expires_at) VALUES (?, ?, NOW(), ?)',
        [cleanPhone, otp, expiryTime]
      );
    } finally {
      connection.release();
    }

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${cleanPhone}`,
      phone: cleanPhone,
      // Remove in production - for testing only
      devOTP: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Verify OTP and authenticate user
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Validate inputs
    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number.',
      });
    }

    if (!otp || !isValidOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP format. OTP must be 6 digits.',
      });
    }

    const cleanPhone = phone.replace(/\D/g, '');

    const connection = await pool.getConnection();
    try {
      // Check if OTP exists, is correct, and not expired
      const [otpRecords] = await connection.execute(
        'SELECT code, expires_at FROM otp_codes WHERE phone = ? ORDER BY created_at DESC LIMIT 1',
        [cleanPhone]
      );

      if (otpRecords.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'OTP not found. Please request a new OTP.',
        });
      }

      const otpRecord = otpRecords[0];

      // Check if OTP is expired
      if (new Date() > new Date(otpRecord.expires_at)) {
        return res.status(401).json({
          success: false,
          message: 'OTP has expired. Please request a new OTP.',
        });
      }

      // Check if OTP matches
      if (otpRecord.code !== otp) {
        return res.status(401).json({
          success: false,
          message: 'Invalid OTP. Please try again.',
        });
      }

      // OTP verified successfully, check if seller exists
      const [sellers] = await connection.execute(
        'SELECT id, phone, shop_name, artisan_name, district, udyam_number, is_profile_complete FROM sellers WHERE phone = ?',
        [cleanPhone]
      );

      let seller;
      if (sellers.length === 0) {
        // Create new seller entry
        const [result] = await connection.execute(
          'INSERT INTO sellers (phone, is_profile_complete) VALUES (?, false)',
          [cleanPhone]
        );
        seller = {
          id: result.insertId,
          phone: cleanPhone,
          shop_name: null,
          artisan_name: null,
          district: null,
          udyam_number: null,
          is_profile_complete: false,
        };
      } else {
        seller = sellers[0];
      }

      // Delete used OTP
      await connection.execute('DELETE FROM otp_codes WHERE phone = ?', [cleanPhone]);

      res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        data: {
          seller: {
            id: seller.id,
            phone: seller.phone,
            shop_name: seller.shop_name,
            artisan_name: seller.artisan_name,
            district: seller.district,
            udyam_number: seller.udyam_number,
            is_profile_complete: seller.is_profile_complete,
          },
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = exports;
