-- Sample data for testing

-- Insert test seller
-- Insert test seller (seller for UI testing)
INSERT INTO sellers (phone, shop_name, artisan_name, district, udyam_number, is_profile_complete)
VALUES ('9123456780', 'Handmade Treasures', 'Sunita Verma', 'Indore', 'UD12345678901', true);

-- Insert sample products
INSERT INTO products (name, description, category, base_district) VALUES
('Handwoven Durrie', 'Traditional handwoven floor durrie from MP artisans', 'Textiles', 'Indore'),
('Terracotta Vase', 'Handmade terracotta vase with natural glaze', 'Pottery', 'Sehore'),
('Brass Candle Holder', 'Polished brass candle holder, handcrafted', 'Metalware', 'Ujjain');

-- Link products to seller with prices and stock
INSERT INTO product_sellers (product_id, seller_id, price, stock) VALUES
((SELECT id FROM products WHERE name='Handwoven Durrie' LIMIT 1), (SELECT id FROM sellers WHERE phone='9123456780' LIMIT 1), 1200.00, 10),
((SELECT id FROM products WHERE name='Terracotta Vase' LIMIT 1), (SELECT id FROM sellers WHERE phone='9123456780' LIMIT 1), 450.00, 15),
((SELECT id FROM products WHERE name='Brass Candle Holder' LIMIT 1), (SELECT id FROM sellers WHERE phone='9123456780' LIMIT 1), 799.00, 8);

-- Insert sample OTP codes (these would expire in 5 minutes)
-- Note: These are for testing purposes only
INSERT INTO otp_codes (phone, code, created_at, expires_at)
VALUES ('9123456789', '123456', NOW(), DATE_ADD(NOW(), INTERVAL 5 MINUTE));
