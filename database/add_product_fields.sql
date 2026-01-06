-- Add new columns to products table
USE odop_marketplace;

ALTER TABLE products 
ADD COLUMN certifications VARCHAR(255) AFTER category,
ADD COLUMN packaging_type VARCHAR(100) AFTER certifications;

-- Verify columns were added
DESCRIBE products;
