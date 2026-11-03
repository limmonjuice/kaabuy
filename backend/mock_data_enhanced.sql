-- =============================================
-- KAABUY POS SYSTEM - ENHANCED MOCK DATA
-- =============================================
-- This is an enhanced version with more comprehensive test data
-- Run this SQL file against your MySQL/MariaDB database
-- IMPORTANT: Run these INSERT statements in order due to FK constraints
-- WARNING: This will add MORE data to your existing database

-- =============================================
-- 1. STAFF (Users) - 8 total staff members
-- =============================================
-- Password for all users is 'password123' hashed with BCrypt
-- BCrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMye.Nw7X5XxqH5.4cA1PRzJ7K3zthsOBOS

INSERT INTO staff (username, password, first_name, last_name, store_name, role, is_active, email, requires_password_change) VALUES
('owner_juan', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Nw7X5XxqH5.4cA1PRzJ7K3zthsOBOS', 'Juan', 'Dela Cruz', 'Kaabuy Sari-Sari Store', 'owner', true, 'juan.delacruz@email.com', false),
('owner_carmela', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Nw7X5XxqH5.4cA1PRzJ7K3zthsOBOS', 'Carmela', 'Garcia', 'Kaabuy Sari-Sari Store', 'owner', true, 'carmela.garcia@email.com', false),
('staff_maria', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Nw7X5XxqH5.4cA1PRzJ7K3zthsOBOS', 'Maria', 'Santos', 'Kaabuy Sari-Sari Store', 'staff', true, 'maria.santos@email.com', false),
('staff_pedro', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Nw7X5XxqH5.4cA1PRzJ7K3zthsOBOS', 'Pedro', 'Reyes', 'Kaabuy Sari-Sari Store', 'staff', true, 'pedro.reyes@email.com', false),
('staff_anna', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Nw7X5XxqH5.4cA1PRzJ7K3zthsOBOS', 'Anna', 'Villanueva', 'Kaabuy Sari-Sari Store', 'staff', true, 'anna.v@email.com', false),
('staff_rico', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Nw7X5XxqH5.4cA1PRzJ7K3zthsOBOS', 'Rico', 'Mendoza', 'Kaabuy Sari-Sari Store', 'staff', true, 'rico.m@email.com', false),
('staff_linda', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Nw7X5XxqH5.4cA1PRzJ7K3zthsOBOS', 'Linda', 'Torres', 'Kaabuy Sari-Sari Store', 'staff', false, 'linda.t@email.com', false),
('staff_test', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Nw7X5XxqH5.4cA1PRzJ7K3zthsOBOS', 'Test', 'User', 'Kaabuy Sari-Sari Store', 'staff', true, 'test@email.com', true);

-- =============================================
-- 2. CUSTOMERS - 20 customers
-- =============================================

INSERT INTO customers (customer_name, contact_number, email, address, created_at) VALUES
-- Original customers
('Aling Nena', '09171234567', 'nena@email.com', '123 Mabini St, Barangay 1', DATE_SUB(NOW(), INTERVAL 180 DAY)),
('Mang Jose', '09181234568', 'jose@email.com', '456 Rizal Ave, Barangay 2', DATE_SUB(NOW(), INTERVAL 160 DAY)),
('Ate Lorna', '09191234569', 'lorna@email.com', '789 Bonifacio Rd, Barangay 3', DATE_SUB(NOW(), INTERVAL 150 DAY)),
('Kuya Ben', '09201234570', 'ben@email.com', '321 Luna St, Barangay 4', DATE_SUB(NOW(), INTERVAL 140 DAY)),
('Tita Cora', '09211234571', 'cora@email.com', '654 Del Pilar Blvd, Barangay 5', DATE_SUB(NOW(), INTERVAL 130 DAY)),
('Nanay Rosa', '09221234572', 'rosa@email.com', '987 Aguinaldo Ave, Barangay 6', DATE_SUB(NOW(), INTERVAL 120 DAY)),
('Tatay Mario', '09231234573', 'mario@email.com', '147 Quezon St, Barangay 7', DATE_SUB(NOW(), INTERVAL 110 DAY)),
('Inday Beth', '09241234574', 'beth@email.com', '258 Osmena Dr, Barangay 8', DATE_SUB(NOW(), INTERVAL 100 DAY)),

-- New customers
('Ka Doms', '09251234575', 'doms@email.com', '369 Magsaysay Blvd, Barangay 9', DATE_SUB(NOW(), INTERVAL 90 DAY)),
('Ate Grace', '09261234576', 'grace@email.com', '741 Roxas Ave, Barangay 10', DATE_SUB(NOW(), INTERVAL 80 DAY)),
('Mang Tomas', '09271234577', 'tomas@email.com', '852 Quirino St, Barangay 11', DATE_SUB(NOW(), INTERVAL 70 DAY)),
('Aling Belen', '09281234578', 'belen@email.com', '963 Laurel Dr, Barangay 12', DATE_SUB(NOW(), INTERVAL 60 DAY)),
('Kuya Edgar', '09291234579', 'edgar@email.com', '159 Ramos Ave, Barangay 13', DATE_SUB(NOW(), INTERVAL 50 DAY)),
('Ate Diana', '09301234580', 'diana@email.com', '357 Garcia St, Barangay 14', DATE_SUB(NOW(), INTERVAL 45 DAY)),
('Nanay Luz', '09311234581', 'luz@email.com', '456 Santos Rd, Barangay 15', DATE_SUB(NOW(), INTERVAL 40 DAY)),
('Tatay Ramon', '09321234582', 'ramon@email.com', '789 Cruz Blvd, Barangay 16', DATE_SUB(NOW(), INTERVAL 35 DAY)),
('Boy Jun', '09331234583', 'jun@email.com', '123 Reyes St, Barangay 17', DATE_SUB(NOW(), INTERVAL 30 DAY)),
('Ate Cherry', '09341234584', 'cherry@email.com', '456 Mendoza Ave, Barangay 18', DATE_SUB(NOW(), INTERVAL 20 DAY)),
('Mang Eddie', '09351234585', 'eddie@email.com', '789 Fernandez Dr, Barangay 19', DATE_SUB(NOW(), INTERVAL 15 DAY)),
('Aling Sofia', '09361234586', 'sofia@email.com', '321 Castillo St, Barangay 20', DATE_SUB(NOW(), INTERVAL 7 DAY));

-- =============================================
-- 3. SUPPLIERS - 10 suppliers
-- =============================================

INSERT INTO suppliers (supplier_name, contact_person, contact_number, address, last_order_date, total_orders, is_preferred) VALUES
('ABC Distributors', 'Mr. Antonio Bautista', '09351112222', '100 Industrial Ave, Makati City', DATE_SUB(NOW(), INTERVAL 7 DAY), 35, true),
('XYZ Trading Corp', 'Ms. Clara Dela Rosa', '09362223333', '200 Commerce St, Pasig City', DATE_SUB(NOW(), INTERVAL 14 DAY), 18, false),
('Metro Grocery Supply', 'Mr. Danny Evangelista', '09373334444', '300 Market Blvd, Mandaluyong', DATE_SUB(NOW(), INTERVAL 3 DAY), 52, true),
('Pinoy Goods Inc.', 'Ms. Elena Fernandez', '09384445555', '400 Trade Center, Quezon City', DATE_SUB(NOW(), INTERVAL 21 DAY), 12, false),
('Fresh Farm Direct', 'Mr. Felix Garcia', '09395556666', '500 Farm Road, Bulacan', DATE_SUB(NOW(), INTERVAL 2 DAY), 28, true),
('Manila Wholesale Hub', 'Mr. George Lim', '09406667777', '600 Wholesale Complex, Manila', DATE_SUB(NOW(), INTERVAL 10 DAY), 22, true),
('Cebu Trading Co.', 'Ms. Helen Tan', '09417778888', '700 Port Area, Cebu City', DATE_SUB(NOW(), INTERVAL 30 DAY), 8, false),
('Davao Supply Chain', 'Mr. Ivan Cruz', '09428889999', '800 Business Park, Davao City', DATE_SUB(NOW(), INTERVAL 45 DAY), 5, false),
('National Distributors', 'Ms. Jenny Aquino', '09439991111', '900 Distribution Center, Caloocan', DATE_SUB(NOW(), INTERVAL 5 DAY), 42, true),
('Budget Wholesale Mart', 'Mr. Karl Santos', '09441112222', '1000 Economic Zone, Marikina', DATE_SUB(NOW(), INTERVAL 12 DAY), 15, false);

-- =============================================
-- 4. PRODUCTS - 70 products across all categories
-- =============================================

INSERT INTO products (product_name, category, base_price, list_price, current_stock, reorder_level, is_low_stock, unit, image_url) VALUES
-- Beverages (15 items)
('Coca-Cola 1.5L', 'Beverages', 45.00, 55.00, 50, 10, false, 'bottle', NULL),
('Sprite 1.5L', 'Beverages', 45.00, 55.00, 45, 10, false, 'bottle', NULL),
('Royal 500ml', 'Beverages', 15.00, 20.00, 100, 20, false, 'bottle', NULL),
('C2 Apple 500ml', 'Beverages', 18.00, 25.00, 80, 15, false, 'bottle', NULL),
('Kopiko 78c', 'Beverages', 20.00, 28.00, 60, 12, false, 'bottle', NULL),
('Nescafe 3in1 Original', 'Beverages', 8.00, 12.00, 200, 50, false, 'sachet', NULL),
('Milo Sachet', 'Beverages', 10.00, 14.00, 150, 30, false, 'sachet', NULL),
('Mountain Dew 1.5L', 'Beverages', 45.00, 55.00, 35, 10, false, 'bottle', NULL),
('Pepsi 1.5L', 'Beverages', 45.00, 55.00, 40, 10, false, 'bottle', NULL),
('Zesto Orange', 'Beverages', 12.00, 18.00, 90, 20, false, 'bottle', NULL),
('Gatorade Blue 500ml', 'Beverages', 25.00, 35.00, 55, 12, false, 'bottle', NULL),
('Red Horse Beer', 'Beverages', 38.00, 52.00, 48, 10, false, 'bottle', NULL),
('San Miguel Pale Pilsen', 'Beverages', 35.00, 48.00, 50, 10, false, 'bottle', NULL),
('Great Taste 3in1', 'Beverages', 8.00, 12.00, 180, 40, false, 'sachet', NULL),
('Iced Coffee Sachet', 'Beverages', 10.00, 15.00, 120, 30, false, 'sachet', NULL),

-- Food & Snacks (20 items)
('Piattos Cheese', 'Food & Snacks', 12.00, 18.00, 75, 15, false, 'pack', NULL),
('Nova Cheddar', 'Food & Snacks', 12.00, 18.00, 70, 15, false, 'pack', NULL),
('Chippy BBQ', 'Food & Snacks', 8.00, 12.00, 90, 20, false, 'pack', NULL),
('Boy Bawang Garlic', 'Food & Snacks', 10.00, 15.00, 85, 18, false, 'pack', NULL),
('Skyflakes Crackers', 'Food & Snacks', 5.00, 8.00, 120, 25, false, 'pack', NULL),
('Oishi Prawn Crackers', 'Food & Snacks', 15.00, 22.00, 55, 12, false, 'pack', NULL),
('555 Sardines Tomato Sauce', 'Food & Snacks', 20.00, 28.00, 80, 20, false, 'can', NULL),
('Century Tuna Flakes', 'Food & Snacks', 25.00, 35.00, 65, 15, false, 'can', NULL),
('Argentina Corned Beef 150g', 'Food & Snacks', 35.00, 48.00, 50, 12, false, 'can', NULL),
('Ligo Sardines Hot', 'Food & Snacks', 18.00, 25.00, 70, 18, false, 'can', NULL),
('CDO Liver Spread', 'Food & Snacks', 22.00, 32.00, 40, 10, false, 'can', NULL),
('Gardenia White Bread', 'Food & Snacks', 55.00, 72.00, 20, 5, false, 'loaf', NULL),
('Fudgee Bar', 'Food & Snacks', 8.00, 12.00, 80, 20, false, 'pc', NULL),
('Rebisco Sandwich', 'Food & Snacks', 5.00, 8.00, 100, 25, false, 'pc', NULL),
('Bear Brand Sachet', 'Food & Snacks', 12.00, 18.00, 100, 25, false, 'sachet', NULL),
('Lucky Me Pancit Canton', 'Food & Snacks', 10.00, 15.00, 120, 30, false, 'pack', NULL),
('Nissin Cup Noodles', 'Food & Snacks', 22.00, 32.00, 50, 12, false, 'cup', NULL),
('Payless Instant Noodles', 'Food & Snacks', 6.00, 9.00, 150, 40, false, 'pack', NULL),
('Clover Chips', 'Food & Snacks', 8.00, 12.00, 95, 20, false, 'pack', NULL),
('Piatos Roadhouse BBQ', 'Food & Snacks', 12.00, 18.00, 65, 15, false, 'pack', NULL),

-- Cooking Essentials (10 items)
('Sinandomeng Rice 1kg', 'Cooking Essentials', 45.00, 58.00, 100, 20, false, 'kg', NULL),
('Jasmine Rice 1kg', 'Cooking Essentials', 55.00, 70.00, 80, 15, false, 'kg', NULL),
('Dinorado Rice 1kg', 'Cooking Essentials', 60.00, 78.00, 60, 12, false, 'kg', NULL),
('Alaska Evap 370ml', 'Cooking Essentials', 35.00, 48.00, 45, 10, false, 'can', NULL),
('Nestle Cream 250ml', 'Cooking Essentials', 40.00, 55.00, 35, 8, false, 'can', NULL),
('Eggs (per piece)', 'Cooking Essentials', 8.00, 10.00, 200, 50, false, 'pc', NULL),
('Cooking Oil 1L', 'Cooking Essentials', 85.00, 110.00, 25, 8, false, 'bottle', NULL),
('White Sugar 1kg', 'Cooking Essentials', 55.00, 68.00, 40, 10, false, 'kg', NULL),
('Brown Sugar 1kg', 'Cooking Essentials', 60.00, 75.00, 30, 8, false, 'kg', NULL),
('All Purpose Flour 1kg', 'Cooking Essentials', 45.00, 58.00, 35, 10, false, 'kg', NULL),

-- Condiments & Seasonings (12 items)
('Datu Puti Soy Sauce 200ml', 'Condiments & Seasonings', 18.00, 25.00, 90, 20, false, 'bottle', NULL),
('Silver Swan Vinegar 200ml', 'Condiments & Seasonings', 15.00, 22.00, 85, 18, false, 'bottle', NULL),
('UFC Banana Ketchup 200ml', 'Condiments & Seasonings', 20.00, 28.00, 75, 15, false, 'bottle', NULL),
('Maggi Magic Sarap', 'Condiments & Seasonings', 8.00, 12.00, 150, 30, false, 'sachet', NULL),
('Knorr Cubes Pork', 'Condiments & Seasonings', 6.00, 10.00, 180, 40, false, 'pc', NULL),
('Datu Puti Fish Sauce', 'Condiments & Seasonings', 22.00, 30.00, 60, 15, false, 'bottle', NULL),
('Mama Sita Oyster Sauce', 'Condiments & Seasonings', 28.00, 38.00, 45, 12, false, 'bottle', NULL),
('Knorr Sinigang Mix', 'Condiments & Seasonings', 10.00, 15.00, 100, 25, false, 'sachet', NULL),
('McCormick Black Pepper', 'Condiments & Seasonings', 12.00, 18.00, 70, 15, false, 'sachet', NULL),
('Salt 1kg', 'Condiments & Seasonings', 15.00, 22.00, 50, 10, false, 'kg', NULL),
('Worcestershire Sauce', 'Condiments & Seasonings', 25.00, 35.00, 35, 10, false, 'bottle', NULL),
('Hot Sauce', 'Condiments & Seasonings', 30.00, 42.00, 28, 8, false, 'bottle', NULL),

-- Personal Care (8 items)
('Safeguard Soap 135g', 'Personal Care', 35.00, 48.00, 60, 15, false, 'bar', NULL),
('Head & Shoulders Sachet', 'Personal Care', 8.00, 12.00, 100, 25, false, 'sachet', NULL),
('Colgate Toothpaste 50ml', 'Personal Care', 25.00, 35.00, 70, 18, false, 'tube', NULL),
('Palmolive Shampoo Sachet', 'Personal Care', 7.00, 11.00, 120, 30, false, 'sachet', NULL),
('Close Up Toothpaste', 'Personal Care', 28.00, 38.00, 55, 15, false, 'tube', NULL),
('Dove Soap', 'Personal Care', 42.00, 58.00, 40, 10, false, 'bar', NULL),
('Creamsilk Conditioner Sachet', 'Personal Care', 8.00, 12.00, 90, 20, false, 'sachet', NULL),
('Rejoice Shampoo Sachet', 'Personal Care', 7.00, 11.00, 110, 25, false, 'sachet', NULL),

-- Others / Miscellaneous (5 items)
('Tide Powder Sachet', 'Others / Miscellaneous', 10.00, 15.00, 150, 35, false, 'sachet', NULL),
('Joy Dishwashing Liquid', 'Others / Miscellaneous', 12.00, 18.00, 90, 20, false, 'sachet', NULL),
('Domex Toilet Cleaner 250ml', 'Others / Miscellaneous', 45.00, 60.00, 30, 8, false, 'bottle', NULL),
('Ariel Powder Sachet', 'Others / Miscellaneous', 10.00, 15.00, 135, 30, false, 'sachet', NULL),
('Zonrox Bleach 250ml', 'Others / Miscellaneous', 35.00, 48.00, 42, 10, false, 'bottle', NULL);

-- =============================================
-- 5. STOCK RECORDS - 50+ stock entries
-- =============================================

INSERT INTO stock_records (stock_quantity, record_type, delivery_date, price_supplier, supplier_id, product_id) VALUES
-- Initial stock deliveries (30 days ago)
(50, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 30 DAY), 45.00, 1, 1),
(45, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 30 DAY), 45.00, 1, 2),
(100, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 30 DAY), 15.00, 1, 3),
(80, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 30 DAY), 18.00, 2, 4),
(60, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 30 DAY), 20.00, 2, 5),
(200, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 30 DAY), 8.00, 3, 6),
(150, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 30 DAY), 10.00, 3, 7),

-- Snacks delivery (25 days ago)
(75, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 25 DAY), 12.00, 3, 16),
(70, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 25 DAY), 12.00, 3, 17),
(90, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 25 DAY), 8.00, 3, 18),
(85, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 25 DAY), 10.00, 3, 19),
(120, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 25 DAY), 5.00, 3, 20),

-- Canned goods delivery (20 days ago)
(80, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 20 DAY), 20.00, 4, 22),
(65, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 20 DAY), 25.00, 4, 23),
(50, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 20 DAY), 35.00, 4, 24),
(70, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 20 DAY), 18.00, 4, 25),
(40, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 20 DAY), 22.00, 4, 26),

-- Rice delivery (15 days ago)
(100, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 15 DAY), 45.00, 5, 36),
(80, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 15 DAY), 55.00, 5, 37),
(60, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 15 DAY), 60.00, 5, 38),

-- Bread and dairy (12 days ago)
(20, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 12 DAY), 55.00, 6, 27),
(80, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 12 DAY), 8.00, 6, 28),
(100, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 12 DAY), 5.00, 6, 29),
(100, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 12 DAY), 12.00, 6, 30),

-- Cooking essentials (10 days ago)
(45, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 10 DAY), 35.00, 1, 39),
(35, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 10 DAY), 40.00, 1, 40),
(200, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 10 DAY), 8.00, 5, 41),
(25, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 10 DAY), 85.00, 5, 42),
(40, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 10 DAY), 55.00, 5, 43),

-- Condiments (8 days ago)
(90, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 8 DAY), 18.00, 9, 46),
(85, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 8 DAY), 15.00, 9, 47),
(75, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 8 DAY), 20.00, 9, 48),
(150, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 8 DAY), 8.00, 9, 49),
(180, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 8 DAY), 6.00, 9, 50),

-- Personal care (7 days ago)
(60, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 7 DAY), 35.00, 3, 56),
(100, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 7 DAY), 8.00, 3, 57),
(70, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 7 DAY), 25.00, 3, 58),
(120, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 7 DAY), 7.00, 3, 59),

-- Instant noodles (5 days ago)
(120, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 5 DAY), 10.00, 6, 31),
(50, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 5 DAY), 22.00, 6, 32),
(150, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 5 DAY), 6.00, 6, 33),

-- Household items (3 days ago)
(150, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 3 DAY), 10.00, 9, 64),
(90, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 3 DAY), 12.00, 9, 65),
(30, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 3 DAY), 45.00, 9, 66),

-- More beverages (2 days ago)
(35, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 2 DAY), 45.00, 1, 8),
(40, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 2 DAY), 45.00, 1, 9),
(90, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 2 DAY), 12.00, 1, 10),
(55, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 2 DAY), 25.00, 1, 11),
(48, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 2 DAY), 38.00, 1, 12),
(50, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 2 DAY), 35.00, 1, 13);

-- =============================================
-- 6. ORDERS - 35 orders (mix of cash, GCash, utang)
-- =============================================

-- Week 1 (30-25 days ago)
INSERT INTO orders (order_date, status, total_amount, staff_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 30 DAY), 'COMPLETED', 165.00, 3, NULL),
(DATE_SUB(NOW(), INTERVAL 29 DAY), 'COMPLETED', 250.00, 3, 1),
(DATE_SUB(NOW(), INTERVAL 28 DAY), 'COMPLETED', 89.00, 4, NULL),
(DATE_SUB(NOW(), INTERVAL 27 DAY), 'COMPLETED', 320.00, 3, 2),
(DATE_SUB(NOW(), INTERVAL 26 DAY), 'COMPLETED', 450.00, 5, NULL),

-- Week 2 (24-18 days ago)
(DATE_SUB(NOW(), INTERVAL 24 DAY), 'COMPLETED', 175.00, 4, NULL),
(DATE_SUB(NOW(), INTERVAL 23 DAY), 'COMPLETED', 285.00, 3, 3),
(DATE_SUB(NOW(), INTERVAL 22 DAY), 'COMPLETED', 95.00, 5, NULL),
(DATE_SUB(NOW(), INTERVAL 21 DAY), 'COMPLETED', 520.00, 4, NULL),
(DATE_SUB(NOW(), INTERVAL 20 DAY), 'COMPLETED', 340.00, 3, 5),

-- Week 3 (17-11 days ago)
(DATE_SUB(NOW(), INTERVAL 17 DAY), 'COMPLETED', 215.00, 5, NULL),
(DATE_SUB(NOW(), INTERVAL 16 DAY), 'COMPLETED', 180.00, 3, 6),
(DATE_SUB(NOW(), INTERVAL 15 DAY), 'COMPLETED', 425.00, 4, NULL),
(DATE_SUB(NOW(), INTERVAL 14 DAY), 'COMPLETED', 155.00, 5, NULL),
(DATE_SUB(NOW(), INTERVAL 13 DAY), 'COMPLETED', 290.00, 3, 7),

-- Week 4 (10-7 days ago)
(DATE_SUB(NOW(), INTERVAL 10 DAY), 'COMPLETED', 380.00, 4, NULL),
(DATE_SUB(NOW(), INTERVAL 9 DAY), 'COMPLETED', 145.00, 3, NULL),
(DATE_SUB(NOW(), INTERVAL 8 DAY), 'COMPLETED', 275.00, 5, 9),
(DATE_SUB(NOW(), INTERVAL 7 DAY), 'COMPLETED', 195.00, 4, NULL),
(DATE_SUB(NOW(), INTERVAL 6 DAY), 'COMPLETED', 510.00, 3, NULL),

-- Recent week (5-3 days ago)
(DATE_SUB(NOW(), INTERVAL 5 DAY), 'COMPLETED', 165.00, 5, NULL),
(DATE_SUB(NOW(), INTERVAL 4 DAY), 'COMPLETED', 230.00, 3, 10),
(DATE_SUB(NOW(), INTERVAL 3 DAY), 'COMPLETED', 185.00, 4, NULL),
(DATE_SUB(NOW(), INTERVAL 2 DAY), 'COMPLETED', 420.00, 5, NULL),
(DATE_SUB(NOW(), INTERVAL 2 DAY), 'COMPLETED', 155.00, 3, 12),

-- Yesterday and Today
(DATE_SUB(NOW(), INTERVAL 1 DAY), 'COMPLETED', 295.00, 4, NULL),
(DATE_SUB(NOW(), INTERVAL 1 DAY), 'COMPLETED', 185.00, 3, 15),
(NOW(), 'COMPLETED', 210.00, 5, NULL),
(NOW(), 'COMPLETED', 145.00, 3, 18),
(NOW(), 'COMPLETED', 55.00, 4, NULL),

-- Additional recent orders
(NOW(), 'COMPLETED', 325.00, 5, NULL),
(NOW(), 'COMPLETED', 180.00, 3, NULL),
(NOW(), 'COMPLETED', 275.00, 4, 20),
(NOW(), 'COMPLETED', 95.00, 5, NULL),
(NOW(), 'COMPLETED', 460.00, 3, NULL);

-- =============================================
-- 7. ORDER ITEMS - Line items for all orders
-- =============================================

-- Order 1 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(1, 1, 2, 55.00, 110.00),
(1, 16, 1, 18.00, 18.00),
(1, 18, 3, 12.00, 36.00);

-- Order 2 items (Aling Nena - utang)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(2, 36, 2, 58.00, 116.00),
(2, 22, 2, 28.00, 56.00),
(2, 23, 2, 35.00, 70.00),
(2, 33, 1, 9.00, 9.00);

-- Order 3 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(3, 3, 3, 20.00, 60.00),
(3, 19, 2, 15.00, 29.00);

-- Order 4 items (Mang Jose - utang)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(4, 37, 3, 70.00, 210.00),
(4, 24, 2, 48.00, 96.00),
(4, 6, 1, 12.00, 12.00);

-- Order 5 items (Large cash order)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(5, 36, 4, 58.00, 232.00),
(5, 31, 10, 15.00, 150.00),
(5, 41, 7, 10.00, 68.00);

-- Order 6 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(6, 1, 2, 55.00, 110.00),
(6, 4, 2, 25.00, 50.00),
(6, 6, 1, 12.00, 12.00);

-- Order 7 items (Ate Lorna - utang)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(7, 38, 2, 78.00, 156.00),
(7, 22, 3, 28.00, 84.00),
(7, 31, 3, 15.00, 45.00);

-- Order 8 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(8, 16, 3, 18.00, 54.00),
(8, 17, 2, 18.00, 36.00),
(8, 28, 1, 12.00, 5.00);

-- Order 9 items (Large purchase)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(9, 36, 5, 58.00, 290.00),
(9, 37, 2, 70.00, 140.00),
(9, 31, 6, 15.00, 90.00);

-- Order 10 items (Tita Cora - utang)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(10, 39, 4, 48.00, 192.00),
(10, 23, 3, 35.00, 105.00),
(10, 31, 3, 15.00, 43.00);

-- Order 11 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(11, 1, 2, 55.00, 110.00),
(11, 2, 2, 55.00, 110.00);

-- Order 12 items (Nanay Rosa - utang)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(12, 36, 2, 58.00, 116.00),
(12, 46, 2, 25.00, 50.00),
(12, 6, 1, 12.00, 12.00);

-- Order 13 items (Large purchase)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(13, 36, 5, 58.00, 290.00),
(13, 42, 1, 110.00, 110.00),
(13, 41, 3, 10.00, 25.00);

-- Order 14 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(14, 56, 2, 48.00, 96.00),
(14, 58, 1, 35.00, 35.00),
(14, 64, 2, 15.00, 24.00);

-- Order 15 items (Tatay Mario - utang)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(15, 37, 3, 70.00, 210.00),
(15, 23, 2, 35.00, 70.00),
(15, 7, 1, 14.00, 10.00);

-- Order 16 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(16, 1, 3, 55.00, 165.00),
(16, 31, 10, 15.00, 150.00),
(16, 41, 7, 10.00, 65.00);

-- Order 17 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(17, 3, 5, 20.00, 100.00),
(17, 16, 2, 18.00, 36.00),
(17, 28, 1, 12.00, 9.00);

-- Order 18 items (Ka Doms - utang)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(18, 36, 3, 58.00, 174.00),
(18, 22, 3, 28.00, 84.00),
(18, 6, 2, 12.00, 17.00);

-- Order 19 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(19, 27, 2, 72.00, 144.00),
(19, 30, 3, 18.00, 51.00);

-- Order 20 items (Large purchase)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(20, 36, 6, 58.00, 348.00),
(20, 42, 1, 110.00, 110.00),
(20, 43, 1, 68.00, 52.00);

-- Order 21 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(21, 1, 2, 55.00, 110.00),
(21, 16, 3, 18.00, 54.00);

-- Order 22 items (Ate Grace - utang)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(22, 37, 2, 70.00, 140.00),
(22, 31, 6, 15.00, 90.00);

-- Order 23 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(23, 56, 3, 48.00, 144.00),
(23, 64, 3, 15.00, 41.00);

-- Order 24 items (Large purchase)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(24, 36, 5, 58.00, 290.00),
(24, 37, 1, 70.00, 70.00),
(24, 41, 6, 10.00, 60.00);

-- Order 25 items (Mang Tomas - utang)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(25, 38, 1, 78.00, 78.00),
(25, 23, 2, 35.00, 70.00),
(25, 7, 1, 14.00, 7.00);

-- Order 26 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(26, 1, 3, 55.00, 165.00),
(26, 31, 8, 15.00, 120.00),
(26, 28, 1, 12.00, 10.00);

-- Order 27 items (Ate Diana - utang)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(27, 36, 2, 58.00, 116.00),
(27, 22, 2, 28.00, 56.00),
(27, 6, 2, 12.00, 13.00);

-- Order 28 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(28, 1, 2, 55.00, 110.00),
(28, 39, 2, 48.00, 96.00);

-- Order 29 items (Kuya Edgar - utang)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(29, 31, 5, 15.00, 75.00),
(29, 37, 1, 70.00, 70.00);

-- Order 30 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(30, 1, 1, 55.00, 55.00);

-- Order 31 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(31, 2, 3, 55.00, 165.00),
(31, 31, 8, 15.00, 120.00),
(31, 16, 2, 18.00, 40.00);

-- Order 32 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(32, 3, 6, 20.00, 120.00),
(32, 4, 3, 25.00, 60.00);

-- Order 33 items (Aling Sofia - utang)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(33, 36, 3, 58.00, 174.00),
(33, 22, 3, 28.00, 84.00),
(33, 6, 2, 12.00, 17.00);

-- Order 34 items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(34, 1, 1, 55.00, 55.00),
(34, 16, 2, 18.00, 36.00);

-- Order 35 items (Large purchase)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(35, 36, 6, 58.00, 348.00),
(35, 31, 7, 15.00, 105.00),
(35, 28, 1, 12.00, 7.00);

-- =============================================
-- 8. TRANSACTIONS - Payment records
-- =============================================

-- Order 1 - Cash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 30 DAY), 165.00, 'Cash', 1, NULL);

-- Order 2 - Utang (Aling Nena)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 29 DAY), 0.00, 'Utang', 2, 1);

-- Order 3 - Cash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 28 DAY), 89.00, 'Cash', 3, NULL);

-- Order 4 - Utang (Mang Jose)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 27 DAY), 0.00, 'Utang', 4, 2);

-- Order 5 - GCash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 26 DAY), 450.00, 'GCash', 5, NULL);

-- Order 6 - Cash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 24 DAY), 175.00, 'Cash', 6, NULL);

-- Order 7 - Utang (Ate Lorna)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 23 DAY), 0.00, 'Utang', 7, 3);

-- Order 8 - GCash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 22 DAY), 95.00, 'GCash', 8, NULL);

-- Order 9 - Cash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 21 DAY), 520.00, 'Cash', 9, NULL);

-- Order 10 - Utang (Tita Cora)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 20 DAY), 0.00, 'Utang', 10, 5);

-- Order 11 - Cash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 17 DAY), 215.00, 'Cash', 11, NULL);

-- Order 12 - Utang (Nanay Rosa)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 16 DAY), 0.00, 'Utang', 12, 6);

-- Order 13 - GCash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 15 DAY), 425.00, 'GCash', 13, NULL);

-- Order 14 - Cash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 14 DAY), 155.00, 'Cash', 14, NULL);

-- Order 15 - Utang (Tatay Mario)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 13 DAY), 0.00, 'Utang', 15, 7);

-- Order 16 - Cash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 10 DAY), 380.00, 'Cash', 16, NULL);

-- Order 17 - GCash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 9 DAY), 145.00, 'GCash', 17, NULL);

-- Order 18 - Utang (Ka Doms)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 8 DAY), 0.00, 'Utang', 18, 9);

-- Order 19 - Cash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 7 DAY), 195.00, 'Cash', 19, NULL);

-- Order 20 - GCash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 6 DAY), 510.00, 'GCash', 20, NULL);

-- Order 21 - Cash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 5 DAY), 165.00, 'Cash', 21, NULL);

-- Order 22 - Utang (Ate Grace)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 4 DAY), 0.00, 'Utang', 22, 10);

-- Order 23 - GCash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 3 DAY), 185.00, 'GCash', 23, NULL);

-- Order 24 - Cash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 2 DAY), 420.00, 'Cash', 24, NULL);

-- Order 25 - Utang (Mang Tomas)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 2 DAY), 0.00, 'Utang', 25, 11);

-- Order 26 - Cash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 1 DAY), 295.00, 'Cash', 26, NULL);

-- Order 27 - Utang (Ate Diana)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 1 DAY), 0.00, 'Utang', 27, 14);

-- Order 28 - GCash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(NOW(), 210.00, 'GCash', 28, NULL);

-- Order 29 - Utang (Kuya Edgar)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(NOW(), 0.00, 'Utang', 29, 13);

-- Order 30 - Cash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(NOW(), 55.00, 'Cash', 30, NULL);

-- Order 31 - Cash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(NOW(), 325.00, 'Cash', 31, NULL);

-- Order 32 - GCash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(NOW(), 180.00, 'GCash', 32, NULL);

-- Order 33 - Utang (Aling Sofia)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(NOW(), 0.00, 'Utang', 33, 20);

-- Order 34 - Cash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(NOW(), 95.00, 'Cash', 34, NULL);

-- Order 35 - GCash
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(NOW(), 460.00, 'GCash', 35, NULL);

-- =============================================
-- 9. PAYMENT TRANSACTIONS (Partial payments for utang)
-- =============================================

-- Aling Nena pays 100 on order 2 (250 total)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 25 DAY), 100.00, 'PAYMENT', 2, 1);

-- Aling Nena pays another 50 (100 remaining)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 20 DAY), 50.00, 'PAYMENT', 2, 1);

-- Mang Jose pays 150 on order 4 (320 total)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 22 DAY), 150.00, 'PAYMENT', 4, 2);

-- Mang Jose pays another 100 (70 remaining)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 15 DAY), 100.00, 'PAYMENT', 4, 2);

-- Ate Lorna pays 100 on order 7 (285 total, 185 remaining)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 18 DAY), 100.00, 'PAYMENT', 7, 3);

-- Tita Cora pays 200 on order 10 (340 total, 140 remaining)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 15 DAY), 200.00, 'PAYMENT', 10, 5);

-- Nanay Rosa pays 80 on order 12 (180 total, 100 remaining)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 12 DAY), 80.00, 'PAYMENT', 12, 6);

-- Tatay Mario pays 150 on order 15 (290 total, 140 remaining)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 8 DAY), 150.00, 'PAYMENT', 15, 7);

-- Ka Doms pays 100 on order 18 (275 total, 175 remaining)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 5 DAY), 100.00, 'PAYMENT', 18, 9);

-- Ate Grace pays full amount on order 22 (230 total, 0 remaining)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 2 DAY), 230.00, 'PAYMENT', 22, 10);

-- =============================================
-- SUMMARY OF ENHANCED MOCK DATA
-- =============================================
-- Staff: 8 (2 owners, 5 active staff, 1 inactive staff)
-- Customers: 20
-- Suppliers: 10
-- Products: 70 (across all categories)
-- Stock Records: 50+
-- Orders: 35
-- Order Items: 100+
-- Transactions: 45+ (including payment transactions)
--
-- Outstanding Utang Summary:
-- - Aling Nena (Order 2): ₱250 - ₱150 paid = ₱100 remaining
-- - Mang Jose (Order 4): ₱320 - ₱250 paid = ₱70 remaining
-- - Ate Lorna (Order 7): ₱285 - ₱100 paid = ₱185 remaining
-- - Tita Cora (Order 10): ₱340 - ₱200 paid = ₱140 remaining
-- - Nanay Rosa (Order 12): ₱180 - ₱80 paid = ₱100 remaining
-- - Tatay Mario (Order 15): ₱290 - ₱150 paid = ₱140 remaining
-- - Ka Doms (Order 18): ₱275 - ₱100 paid = ₱175 remaining
-- - Ate Grace (Order 22): ₱230 - ₱230 paid = PAID IN FULL ✓
-- - Mang Tomas (Order 25): ₱155 - ₱0 paid = ₱155 remaining
-- - Ate Diana (Order 27): ₱185 - ₱0 paid = ₱185 remaining
-- - Kuya Edgar (Order 29): ₱145 - ₱0 paid = ₱145 remaining
-- - Aling Sofia (Order 33): ₱275 - ₱0 paid = ₱275 remaining
--
-- Total Outstanding Credit: ₱1,770
-- =============================================
