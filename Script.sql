-- ======================================
-- Create the database and select it
-- ======================================
CREATE DATABASE awe_online_electronics_store;
USE awe_online_electronics_store;

-- ======================================
-- Table: users (customers)
-- ======================================
CREATE TABLE users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================
-- Table: staff (admin and employees)
-- ======================================
CREATE TABLE staff (
    staffId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================
-- Table: products
-- ======================================
CREATE TABLE products (
    productId INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    categoryId INT,
    image VARCHAR(255)
);

-- Modify image column to store binary image data instead of path
ALTER TABLE products MODIFY image MEDIUMBLOB;

-- ======================================
-- View all tables in the database
-- ======================================
SHOW TABLES;

-- ======================================
-- Insert a sample staff user (plaintext password for test)
-- ======================================
INSERT INTO staff (name, email, password) 
VALUES ('Admin User', 'staff@example.com', 'admin123');

-- ======================================
-- View user and staff data
-- ======================================
SELECT * FROM users;
SELECT * FROM staff;

-- ======================================
-- Delete a staff user by ID (for cleanup/testing)
-- ======================================
DELETE FROM staff WHERE staffId = '3';

-- ======================================
-- Delete staff user by email (cleanup)
-- ======================================
DELETE FROM staff WHERE email = 'staff@example.com';

-- ======================================
-- (Incorrect) Attempt to insert hashed password using UNHEX (not recommended)
-- ======================================
INSERT INTO staff (name, email, password)
VALUES ('Admin User', 'staff@example.com', UNHEX('admin123'));

-- ======================================
-- Insert sample product entries
-- NOTE: These image paths are placeholders; actual binary data should be inserted in production
-- ======================================
INSERT INTO products (title, price, categoryId, image) VALUES
('Laptop Pro 15', 999.99, 1, '/Users/aarush/Desktop/Year 4 - Sem 1/SWE 30003/Assignment 3/awe-online-electronics-store/frontend/assets/images/laptop.png'),
('Smartphone X12', 699.99, 2, '/Users/aarush/Desktop/Year 4 - Sem 1/SWE 30003/Assignment 3/awe-online-electronics-store/frontend/assets/images/phone.png'),
('Wireless Headphones', 149.99, 3, '/Users/aarush/Desktop/Year 4 - Sem 1/SWE 30003/Assignment 3/awe-online-electronics-store/frontend/assets/images/headphones.png'),
('Smart Watch V3', 199.99, 4, '/Users/aarush/Desktop/Year 4 - Sem 1/SWE 30003/Assignment 3/awe-online-electronics-store/frontend/assets/images/smartwatch.png'),
('Gaming Mouse', 59.99, 5, '/Users/aarush/Desktop/Year 4 - Sem 1/SWE 30003/Assignment 3/awe-online-electronics-store/frontend/assets/images/keyboard.png'),
('Bluetooth Speaker', 89.99, 6, '/Users/aarush/Desktop/Year 4 - Sem 1/SWE 30003/Assignment 3/awe-online-electronics-store/frontend/assets/images/speaker.png'),
('4K Monitor 27"', 349.99, 1, '/Users/aarush/Desktop/Year 4 - Sem 1/SWE 30003/Assignment 3/awe-online-electronics-store/frontend/assets/images/monitor.png'),
('Tablet S10', 499.99, 2, '/Users/aarush/Desktop/Year 4 - Sem 1/SWE 30003/Assignment 3/awe-online-electronics-store/frontend/assets/images/ipad.png'),
('Keyboard Mechanical', 129.99, 5, '/Users/aarush/Desktop/Year 4 - Sem 1/SWE 30003/Assignment 3/awe-online-electronics-store/frontend/assets/images/keyboard.png');

-- ======================================
-- Query a specific product by ID
-- ======================================
SELECT * FROM products WHERE productId = 2;

-- ======================================
-- Update image path for a specific product
-- ======================================
UPDATE products 
SET image = '/path/to/mouse.png' 
WHERE productId = 5;

-- ======================================
-- Add product description column
-- ======================================
ALTER TABLE products ADD COLUMN description TEXT;

-- ======================================
-- Update product descriptions
-- ======================================
UPDATE products SET description = 'High-performance laptop with a 15-inch display.' WHERE productId = 1;
UPDATE products SET description = 'Latest smartphone with advanced camera features.' WHERE productId = 2;
UPDATE products SET description = 'Wireless headphones with noise cancellation.' WHERE productId = 3;
UPDATE products SET description = 'Smartwatch with fitness tracking and notifications.' WHERE productId = 4;
UPDATE products SET description = 'Ergonomic gaming mouse with customizable buttons.' WHERE productId = 5;
UPDATE products SET description = 'Portable Bluetooth speaker with deep bass.' WHERE productId = 6;
UPDATE products SET description = '27-inch 4K monitor with vibrant colors.' WHERE productId = 7;
UPDATE products SET description = '10-inch tablet with stylus support.' WHERE productId = 8;
UPDATE products SET description = 'Mechanical keyboard with RGB lighting.' WHERE productId = 9;

-- ======================================
-- Add product rating column
-- ======================================
ALTER TABLE products ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.00;

-- ======================================
-- Update product ratings
-- ======================================
UPDATE products SET rating = 4.8 WHERE productId = 1;
UPDATE products SET rating = 4.5 WHERE productId = 2;
UPDATE products SET rating = 4.3 WHERE productId = 3;
UPDATE products SET rating = 4.1 WHERE productId = 4;
UPDATE products SET rating = 4.6 WHERE productId = 5;
UPDATE products SET rating = 4.2 WHERE productId = 6;
UPDATE products SET rating = 4.7 WHERE productId = 7;
UPDATE products SET rating = 4.4 WHERE productId = 8;
UPDATE products SET rating = 4.9 WHERE productId = 9;

-- ======================================
-- Add discount and original price columns
-- ======================================
ALTER TABLE products ADD COLUMN discount_percentage INT DEFAULT 0;
ALTER TABLE products ADD COLUMN original_price DECIMAL(10, 2) DEFAULT NULL;

-- ======================================
-- Update discounts and original prices
-- ======================================
UPDATE products SET discount_percentage = 20, original_price = 1249.99 WHERE productId = 1;
UPDATE products SET discount_percentage = 15, original_price = 823.52 WHERE productId = 2;
UPDATE products SET discount_percentage = 25, original_price = 199.99 WHERE productId = 3;
UPDATE products SET discount_percentage = 10, original_price = 222.21 WHERE productId = 4;
UPDATE products SET discount_percentage = 0, original_price = NULL WHERE productId = 5;
UPDATE products SET discount_percentage = 18, original_price = 109.75 WHERE productId = 6;
UPDATE products SET discount_percentage = 12, original_price = 397.71 WHERE productId = 7;
UPDATE products SET discount_percentage = 23, original_price = 649.34 WHERE productId = 8;
UPDATE products SET discount_percentage = 0, original_price = NULL WHERE productId = 9;

-- ======================================
-- Table: cart_items (user shopping cart)
-- ======================================
CREATE TABLE cart_items (
    cartItemId INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products(productId),
    UNIQUE KEY unique_cart_item (userId, productId)
);

-- ======================================
-- Check if cart is being updated for user ID = 3
-- ======================================
SELECT * FROM cart_items WHERE userId = '3';

-- ======================================
-- Table: orders (main order info)
-- ======================================
CREATE TABLE orders (
    orderId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    total DECIMAL(10, 2),
    shipping JSON,
    payment JSON,
    status VARCHAR(20) DEFAULT 'pending',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(userId)
);

-- ======================================
-- Table: order_items (items under each order)
-- ======================================
CREATE TABLE order_items (
    orderItemId INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT,
    productId INT,
    quantity INT,
    price DECIMAL(10, 2),
    FOREIGN KEY (orderId) REFERENCES orders(orderId),
    FOREIGN KEY (productId) REFERENCES products(productId)
);

-- ======================================
-- View orders of a specific user
-- ======================================
SELECT * FROM orders WHERE userId = 3;

-- ======================================
-- Drop and recreate the staff table with a role column
-- ======================================
DROP TABLE IF EXISTS staff;

CREATE TABLE staff (
    staffId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'staff', -- New: role (admin/staff)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================
-- View all staff
-- ======================================
SELECT * FROM staff;

-- ======================================
-- Insert admin staff with hashed password (bcrypt)
-- ======================================
INSERT INTO staff (name, email, password, role) 
VALUES (
    'Admin User',
    'staff@example.com',
    '$2b$12$wSWd2RE1kQhP7sS4Qn2a2.adlEJa7H2UcZlRVC.jEIGaWgdrr9e/K',
    'admin'
);

-- ======================================
-- View all products
-- ======================================
SELECT * FROM products;

-- ======================================
-- View all orders
-- ======================================
SELECT * FROM orders;
