-- Create ODOP Marketplace Database Schema

-- Create sellers table
CREATE TABLE IF NOT EXISTS sellers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  phone VARCHAR(10) UNIQUE NOT NULL,
  shop_name VARCHAR(100) DEFAULT NULL,
  artisan_name VARCHAR(100) DEFAULT NULL,
  district VARCHAR(50) DEFAULT NULL,
  udyam_number VARCHAR(20) DEFAULT NULL,
  is_profile_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_phone (phone),
  INDEX idx_district (district),
  INDEX idx_is_profile_complete (is_profile_complete)
);

-- Create otp_codes table for temporary OTP storage
CREATE TABLE IF NOT EXISTS otp_codes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  phone VARCHAR(10) NOT NULL,
  code VARCHAR(6) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  
  INDEX idx_phone (phone),
  INDEX idx_expires_at (expires_at)
);

-- Optional: Create a table for tracking OTP attempts (for security)
CREATE TABLE IF NOT EXISTS otp_attempts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  phone VARCHAR(10) NOT NULL,
  attempt_count INT DEFAULT 1,
  last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_blocked BOOLEAN DEFAULT false,
  blocked_until TIMESTAMP DEFAULT NULL,
  
  UNIQUE KEY unique_phone (phone),
  INDEX idx_phone (phone)
);

-- Create products table for product listings
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vendor_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (vendor_id) REFERENCES sellers(id) ON DELETE CASCADE,
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_category (category),
  INDEX idx_created_at (created_at)
);
