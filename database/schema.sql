-- Create ODOP Marketplace Database Schema for Buyers

-- Create buyers table

CREATE TABLE IF NOT EXISTS buyers (
  id INT PRIMARY KEY AUTO_INCREMENT,

  phone VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100),
  email VARCHAR(100),

  org_type ENUM(
    'INDIVIDUAL',
    'PROPRIETORSHIP',
    'PARTNERSHIP',
    'COMPANY',
    'CO_OPERATIVE',
    'JOINT_VENTURE',
    'TRUST',
    'SOCIETY',
    'LLP',
    'PSU_CENTRAL',
    'PSU_STATE',
    'NOT_REGISTERED_IN_INDIA'
  ) NOT NULL,

  gst_no VARCHAR(15),
  district_name VARCHAR(50),

  is_profile_complete BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_phone (phone),
  INDEX idx_district_name (district_name),
  INDEX idx_is_profile_complete (is_profile_complete)
);


-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  base_district VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_category (category),
  INDEX idx_base_district (base_district),
  INDEX idx_created_at (created_at)
);

-- Create sellers table
CREATE TABLE IF NOT EXISTS sellers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  phone VARCHAR(10) UNIQUE NOT NULL,
  shop_name VARCHAR(100) NOT NULL,
  artisan_name VARCHAR(100) NOT NULL,
  district VARCHAR(50) NOT NULL,
  udyam_number VARCHAR(20) UNIQUE NOT NULL,
  is_profile_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_phone (phone),
  INDEX idx_district (district),
  INDEX idx_udyam_number (udyam_number),
  INDEX idx_is_profile_complete (is_profile_complete)
);

-- Create product_sellers link table
CREATE TABLE IF NOT EXISTS product_sellers (
  product_id INT NOT NULL,
  seller_id INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (product_id, seller_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id),
  INDEX idx_seller_id (seller_id),
  INDEX idx_price (price)
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
