-- Add quantity_per_month column to products table
USE odop_marketplace;

ALTER TABLE products 
ADD COLUMN quantity_per_month INT AFTER category;

-- Verify column was added
DESCRIBE products;
