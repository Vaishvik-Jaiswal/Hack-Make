-- Sample data for testing

-- Insert test seller
INSERT INTO sellers (phone, shop_name, artisan_name, district, udyam_number, is_profile_complete)
VALUES ('9876543210', 'Test Shop', 'Test Artisan', 'Indore', 'UD12AB1234567', true);

-- Insert sample OTP codes (these would expire in 5 minutes)
-- Note: These are for testing purposes only
INSERT INTO otp_codes (phone, code, created_at, expires_at)
VALUES ('9123456789', '123456', NOW(), DATE_ADD(NOW(), INTERVAL 5 MINUTE));
