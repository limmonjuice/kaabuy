-- =============================================
-- KAABUY POS SYSTEM - MOCK DATA
-- =============================================
-- Run this SQL file against your MySQL/MariaDB database
-- IMPORTANT: Run these INSERT statements in order due to FK constraints

-- =============================================
-- 1. STAFF (Users)
-- =============================================
-- Password for all users is 'password123' hashed with BCrypt
-- You may need to regenerate these hashes or use your own

INSERT INTO staff (username, password, first_name, last_name, store_name, role, is_active, email, requires_password_change) VALUES
('owner_juan', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Nw7X5XxqH5.4cA1PRzJ7K3zthsOBOS', 'Juan', 'Dela Cruz', 'Kaabuy Sari-Sari Store', 'owner', true, 'juan.delacruz@email.com', false),
('staff_maria', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Nw7X5XxqH5.4cA1PRzJ7K3zthsOBOS', 'Maria', 'Santos', 'Kaabuy Sari-Sari Store', 'staff', true, 'maria.santos@email.com', false),
('staff_pedro', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Nw7X5XxqH5.4cA1PRzJ7K3zthsOBOS', 'Pedro', 'Reyes', 'Kaabuy Sari-Sari Store', 'staff', true, 'pedro.reyes@email.com', false);

-- =============================================
-- 2. CUSTOMERS
-- =============================================

INSERT INTO customers (customer_name, contact_number, email, address, created_at) VALUES
('Aling Nena', '09171234567', 'nena@email.com', '123 Mabini St, Barangay 1', NOW()),
('Mang Jose', '09181234568', 'jose@email.com', '456 Rizal Ave, Barangay 2', NOW()),
('Ate Lorna', '09191234569', 'lorna@email.com', '789 Bonifacio Rd, Barangay 3', NOW()),
('Kuya Ben', '09201234570', 'ben@email.com', '321 Luna St, Barangay 4', NOW()),
('Tita Cora', '09211234571', 'cora@email.com', '654 Del Pilar Blvd, Barangay 5', NOW()),
('Nanay Rosa', '09221234572', 'rosa@email.com', '987 Aguinaldo Ave, Barangay 6', NOW()),
('Tatay Mario', '09231234573', 'mario@email.com', '147 Quezon St, Barangay 7', NOW()),
('Inday Beth', '09241234574', 'beth@email.com', '258 Osmena Dr, Barangay 8', NOW());

-- =============================================
-- 3. SUPPLIERS
-- =============================================

INSERT INTO suppliers (supplier_name, contact_person, contact_number, address, last_order_date, total_orders, is_preferred) VALUES
('ABC Distributors', 'Mr. Antonio Bautista', '09351112222', '100 Industrial Ave, Makati City', DATE_SUB(NOW(), INTERVAL 7 DAY), 15, true),
('XYZ Trading Corp', 'Ms. Clara Dela Rosa', '09362223333', '200 Commerce St, Pasig City', DATE_SUB(NOW(), INTERVAL 14 DAY), 8, false),
('Metro Grocery Supply', 'Mr. Danny Evangelista', '09373334444', '300 Market Blvd, Mandaluyong', DATE_SUB(NOW(), INTERVAL 3 DAY), 22, true),
('Pinoy Goods Inc.', 'Ms. Elena Fernandez', '09384445555', '400 Trade Center, Quezon City', DATE_SUB(NOW(), INTERVAL 21 DAY), 5, false),
('Fresh Farm Direct', 'Mr. Felix Garcia', '09395556666', '500 Farm Road, Bulacan', DATE_SUB(NOW(), INTERVAL 2 DAY), 12, true);

-- =============================================
-- 4. PRODUCTS
-- =============================================

INSERT INTO products (product_name, category, base_price, list_price, current_stock, reorder_level, is_low_stock, unit, image_url) VALUES
-- Beverages
('Coca-Cola 1.5L', 'Beverages', 45.00, 55.00, 50, 10, false, 'bottle', NULL),
('Sprite 1.5L', 'Beverages', 45.00, 55.00, 45, 10, false, 'bottle', NULL),
('Royal 500ml', 'Beverages', 15.00, 20.00, 100, 20, false, 'bottle', NULL),
('C2 Apple 500ml', 'Beverages', 18.00, 25.00, 80, 15, false, 'bottle', NULL),
('Kopiko 78c', 'Beverages', 20.00, 28.00, 60, 12, false, 'bottle', NULL),
('Nescafe 3in1 Original', 'Beverages', 8.00, 12.00, 200, 50, false, 'sachet', NULL),
('Milo Sachet', 'Beverages', 10.00, 14.00, 150, 30, false, 'sachet', NULL),

-- Snacks
('Piattos Cheese', 'Food & Snacks', 12.00, 18.00, 75, 15, false, 'pack', NULL),
('Nova Cheddar', 'Food & Snacks', 12.00, 18.00, 70, 15, false, 'pack', NULL),
('Chippy BBQ', 'Food & Snacks', 8.00, 12.00, 90, 20, false, 'pack', NULL),
('Boy Bawang Garlic', 'Food & Snacks', 10.00, 15.00, 85, 18, false, 'pack', NULL),
('Skyflakes Crackers', 'Food & Snacks', 5.00, 8.00, 120, 25, false, 'pack', NULL),
('Oishi Prawn Crackers', 'Food & Snacks', 15.00, 22.00, 55, 12, false, 'pack', NULL),

-- Canned Goods
('555 Sardines Tomato Sauce', 'Food & Snacks', 20.00, 28.00, 80, 20, false, 'can', NULL),
('Century Tuna Flakes', 'Food & Snacks', 25.00, 35.00, 65, 15, false, 'can', NULL),
('Argentina Corned Beef 150g', 'Food & Snacks', 35.00, 48.00, 50, 12, false, 'can', NULL),
('Ligo Sardines Hot', 'Food & Snacks', 18.00, 25.00, 70, 18, false, 'can', NULL),
('CDO Liver Spread', 'Food & Snacks', 22.00, 32.00, 40, 10, false, 'can', NULL),

-- Rice & Grains
('Sinandomeng Rice 1kg', 'Cooking Essentials', 45.00, 58.00, 100, 20, false, 'kg', NULL),
('Jasmine Rice 1kg', 'Cooking Essentials', 55.00, 70.00, 80, 15, false, 'kg', NULL),
('Dinorado Rice 1kg', 'Cooking Essentials', 60.00, 78.00, 60, 12, false, 'kg', NULL),

-- Condiments
('Datu Puti Soy Sauce 200ml', 'Condiments & Seasonings', 18.00, 25.00, 90, 20, false, 'bottle', NULL),
('Silver Swan Vinegar 200ml', 'Condiments & Seasonings', 15.00, 22.00, 85, 18, false, 'bottle', NULL),
('UFC Banana Ketchup 200ml', 'Condiments & Seasonings', 20.00, 28.00, 75, 15, false, 'bottle', NULL),
('Maggi Magic Sarap', 'Condiments & Seasonings', 8.00, 12.00, 150, 30, false, 'sachet', NULL),
('Knorr Cubes Pork', 'Condiments & Seasonings', 6.00, 10.00, 180, 40, false, 'pc', NULL),

-- Personal Care
('Safeguard Soap 135g', 'Personal Care', 35.00, 48.00, 60, 15, false, 'bar', NULL),
('Head & Shoulders Sachet', 'Personal Care', 8.00, 12.00, 100, 25, false, 'sachet', NULL),
('Colgate Toothpaste 50ml', 'Personal Care', 25.00, 35.00, 70, 18, false, 'tube', NULL),
('Palmolive Shampoo Sachet', 'Personal Care', 7.00, 11.00, 120, 30, false, 'sachet', NULL),

-- Household
('Tide Powder Sachet', 'Others / Miscellaneous', 10.00, 15.00, 150, 35, false, 'sachet', NULL),
('Joy Dishwashing Liquid', 'Others / Miscellaneous', 12.00, 18.00, 90, 20, false, 'sachet', NULL),
('Domex Toilet Cleaner 250ml', 'Others / Miscellaneous', 45.00, 60.00, 30, 8, false, 'bottle', NULL),

-- Bread & Bakery
('Gardenia White Bread', 'Food & Snacks', 55.00, 72.00, 20, 5, false, 'loaf', NULL),
('Fudgee Bar', 'Food & Snacks', 8.00, 12.00, 80, 20, false, 'pc', NULL),
('Rebisco Sandwich', 'Food & Snacks', 5.00, 8.00, 100, 25, false, 'pc', NULL),

-- Dairy & Frozen
('Bear Brand Sachet', 'Food & Snacks', 12.00, 18.00, 100, 25, false, 'sachet', NULL),
('Alaska Evap 370ml', 'Cooking Essentials', 35.00, 48.00, 45, 10, false, 'can', NULL),
('Nestle Cream 250ml', 'Cooking Essentials', 40.00, 55.00, 35, 8, false, 'can', NULL),

-- Eggs & Instant
('Eggs (per piece)', 'Cooking Essentials', 8.00, 10.00, 200, 50, false, 'pc', NULL),
('Lucky Me Pancit Canton', 'Food & Snacks', 10.00, 15.00, 120, 30, false, 'pack', NULL),
('Nissin Cup Noodles', 'Food & Snacks', 22.00, 32.00, 50, 12, false, 'cup', NULL),
('Payless Instant Noodles', 'Food & Snacks', 6.00, 9.00, 150, 40, false, 'pack', NULL);

-- =============================================
-- 5. STOCK RECORDS (Initial inventory)
-- =============================================

INSERT INTO stock_records (stock_quantity, record_type, delivery_date, price_supplier, supplier_id, product_id) VALUES
-- Initial stock for Beverages
(50, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 30 DAY), 45.00, 1, 1),
(45, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 30 DAY), 45.00, 1, 2),
(100, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 28 DAY), 15.00, 1, 3),
(80, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 28 DAY), 18.00, 2, 4),
(60, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 25 DAY), 20.00, 2, 5),

-- Initial stock for Snacks
(75, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 20 DAY), 12.00, 3, 8),
(70, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 20 DAY), 12.00, 3, 9),
(90, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 18 DAY), 8.00, 3, 10),

-- Initial stock for Canned Goods
(80, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 15 DAY), 20.00, 4, 14),
(65, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 15 DAY), 25.00, 4, 15),
(50, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 14 DAY), 35.00, 4, 16),

-- Initial stock for Rice
(100, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 10 DAY), 45.00, 5, 20),
(80, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 10 DAY), 55.00, 5, 21),
(60, 'RECEIVED', DATE_SUB(NOW(), INTERVAL 10 DAY), 60.00, 5, 22);

-- =============================================
-- 6. ORDERS (Sales transactions)
-- =============================================

-- Order 1: Cash sale
INSERT INTO orders (order_date, status, total_amount, staff_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 5 DAY), 'COMPLETED', 165.00, 2, NULL);

-- Order 2: Utang (Credit) sale - Aling Nena
INSERT INTO orders (order_date, status, total_amount, staff_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 4 DAY), 'COMPLETED', 250.00, 2, 1);

-- Order 3: Cash sale
INSERT INTO orders (order_date, status, total_amount, staff_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 3 DAY), 'COMPLETED', 89.00, 3, NULL);

-- Order 4: Utang (Credit) sale - Mang Jose
INSERT INTO orders (order_date, status, total_amount, staff_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 3 DAY), 'COMPLETED', 320.00, 2, 2);

-- Order 5: GCash sale
INSERT INTO orders (order_date, status, total_amount, staff_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 2 DAY), 'COMPLETED', 150.00, 3, NULL);

-- Order 6: Cash sale
INSERT INTO orders (order_date, status, total_amount, staff_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 2 DAY), 'COMPLETED', 78.00, 2, NULL);

-- Order 7: Utang (Credit) sale - Ate Lorna
INSERT INTO orders (order_date, status, total_amount, staff_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 1 DAY), 'COMPLETED', 185.00, 3, 3);

-- Order 8: Cash sale (Today)
INSERT INTO orders (order_date, status, total_amount, staff_id, customer_id) VALUES
(NOW(), 'COMPLETED', 210.00, 2, NULL);

-- Order 9: Utang (Credit) sale - Kuya Ben (Today)
INSERT INTO orders (order_date, status, total_amount, staff_id, customer_id) VALUES
(NOW(), 'COMPLETED', 145.00, 3, 4);

-- Order 10: Cash sale (Today)
INSERT INTO orders (order_date, status, total_amount, staff_id, customer_id) VALUES
(NOW(), 'COMPLETED', 55.00, 2, NULL);

-- =============================================
-- 7. ORDER ITEMS
-- =============================================

-- Order 1 items (Cash sale - 165.00)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(1, 1, 2, 55.00, 110.00),   -- 2x Coca-Cola 1.5L
(1, 8, 1, 18.00, 18.00),    -- 1x Piattos Cheese
(1, 10, 3, 12.00, 36.00);   -- 3x Chippy BBQ

-- Order 2 items (Utang - Aling Nena - 250.00)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(2, 20, 2, 58.00, 116.00),  -- 2x Sinandomeng Rice 1kg
(2, 14, 2, 28.00, 56.00),   -- 2x 555 Sardines
(2, 15, 2, 35.00, 70.00),   -- 2x Century Tuna
(2, 45, 1, 9.00, 9.00);      -- 1x Payless Noodles

-- Order 3 items (Cash sale - 89.00)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(3, 3, 3, 20.00, 60.00),    -- 3x Royal 500ml
(3, 11, 2, 15.00, 29.00);   -- 2x Boy Bawang

-- Order 4 items (Utang - Mang Jose - 320.00)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(4, 21, 3, 70.00, 210.00),  -- 3x Jasmine Rice 1kg
(4, 16, 2, 48.00, 96.00),   -- 2x Argentina Corned Beef
(4, 6, 1, 12.00, 12.00);    -- 1x Nescafe

-- Order 5 items (GCash sale - 150.00)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(5, 35, 2, 72.00, 144.00),  -- 2x Gardenia White Bread
(5, 36, 1, 12.00, 6.00);    -- 1x Fudgee Bar (adjusted)

-- Order 6 items (Cash sale - 78.00)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(6, 28, 2, 48.00, 48.00),   -- 2x Safeguard Soap
(6, 30, 1, 35.00, 30.00);   -- 1x Colgate

-- Order 7 items (Utang - Ate Lorna - 185.00)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(7, 22, 2, 78.00, 156.00),  -- 2x Dinorado Rice 1kg
(7, 12, 2, 8.00, 16.00),    -- 2x Skyflakes
(7, 6, 1, 12.00, 12.00);    -- 1x Nescafe

-- Order 8 items (Cash sale Today - 210.00)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(8, 1, 2, 55.00, 110.00),   -- 2x Coca-Cola 1.5L
(8, 39, 2, 48.00, 96.00);   -- 2x Alaska Evap

-- Order 9 items (Utang - Kuya Ben Today - 145.00)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(9, 43, 5, 15.00, 75.00),   -- 5x Lucky Me Pancit Canton
(9, 21, 1, 70.00, 70.00);   -- 1x Jasmine Rice 1kg

-- Order 10 items (Cash sale Today - 55.00)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(10, 1, 1, 55.00, 55.00);   -- 1x Coca-Cola 1.5L

-- =============================================
-- 8. TRANSACTIONS
-- =============================================

-- Transaction for Order 1 (Cash)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 5 DAY), 165.00, 'Cash', 1, NULL);

-- Transaction for Order 2 (Utang - Aling Nena)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 4 DAY), 0.00, 'Utang', 2, 1);

-- Transaction for Order 3 (Cash)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 3 DAY), 89.00, 'Cash', 3, NULL);

-- Transaction for Order 4 (Utang - Mang Jose)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 3 DAY), 0.00, 'Utang', 4, 2);

-- Transaction for Order 5 (GCash)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 2 DAY), 150.00, 'GCash', 5, NULL);

-- Transaction for Order 6 (Cash)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 2 DAY), 78.00, 'Cash', 6, NULL);

-- Transaction for Order 7 (Utang - Ate Lorna)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 1 DAY), 0.00, 'Utang', 7, 3);

-- Transaction for Order 8 (Cash Today)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(NOW(), 210.00, 'Cash', 8, NULL);

-- Transaction for Order 9 (Utang - Kuya Ben Today)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(NOW(), 0.00, 'Utang', 9, 4);

-- Transaction for Order 10 (Cash Today)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(NOW(), 55.00, 'Cash', 10, NULL);

-- =============================================
-- 9. SAMPLE PAYMENT TRANSACTIONS (for Utang)
-- =============================================

-- Partial payment by Aling Nena for Order 2 (₱100 of ₱250)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 2 DAY), 100.00, 'PAYMENT', 2, 1);

-- Partial payment by Mang Jose for Order 4 (₱150 of ₱320)
INSERT INTO transactions (transaction_date, amount, payment_method, order_id, customer_id) VALUES
(DATE_SUB(NOW(), INTERVAL 1 DAY), 150.00, 'PAYMENT', 4, 2);

-- =============================================
-- SUMMARY OF MOCK DATA
-- =============================================
-- Staff: 3 (1 owner, 2 staff)
-- Customers: 8
-- Suppliers: 5
-- Products: 45 (across 11 categories)
-- Stock Records: 14
-- Orders: 10
-- Order Items: 28
-- Transactions: 12 (including 2 payment transactions)
--
-- Outstanding Utang:
-- - Aling Nena: ₱250 - ₱100 = ₱150 remaining
-- - Mang Jose: ₱320 - ₱150 = ₱170 remaining
-- - Ate Lorna: ₱185 (no payment yet)
-- - Kuya Ben: ₱145 (no payment yet)
-- =============================================
