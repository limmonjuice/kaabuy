# Kaabuy POS System - Mock Data Import Guide

## Overview
This guide provides detailed instructions for importing mock data into your Kaabuy POS system database. Three mock data files are available:

1. **mock_data.sql** - Original dataset (45 products, 10 orders, basic test data)
2. **mock_data_enhanced.sql** - Comprehensive dataset (70 products, 35 orders, extensive test scenarios)
3. **mock_data.json** - JSON format for API/programmatic imports

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Method 1: Import SQL Files via MySQL Command Line](#method-1-import-sql-files-via-mysql-command-line)
- [Method 2: Import SQL Files via MySQL Workbench](#method-2-import-sql-files-via-mysql-workbench)
- [Method 3: Import SQL Files via phpMyAdmin](#method-3-import-sql-files-via-phpmyadmin)
- [Method 4: Import JSON Data via Java Application](#method-4-import-json-data-via-java-application)
- [Verify Import](#verify-import)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Database Configuration
Your database should already be created with the following configuration:
- **Database Name**: `kaabuy_db`
- **Host**: `localhost`
- **Port**: `3310`
- **User**: Your MySQL user (from application.properties)
- **Password**: Your MySQL password

### Tables
All tables should already exist (auto-created by Hibernate). If not, start your Spring Boot application once to generate the schema:

```bash
./mvnw spring-boot:run
```

### Choose Your Dataset

#### Option A: Original Dataset (mock_data.sql)
- **Best for**: Quick testing, basic functionality validation
- **Contains**:
  - 3 staff members
  - 8 customers
  - 5 suppliers
  - 45 products
  - 10 orders
  - Basic utang scenarios

#### Option B: Enhanced Dataset (mock_data_enhanced.sql) **RECOMMENDED**
- **Best for**: Comprehensive testing, realistic scenarios, performance testing
- **Contains**:
  - 8 staff members (including inactive staff)
  - 20 customers
  - 10 suppliers
  - 70 products across all categories
  - 35 orders spanning 30 days
  - Complex utang scenarios with partial payments
  - ₱1,770 total outstanding credit

#### Option C: JSON Format (mock_data.json)
- **Best for**: Programmatic imports, API testing, custom data manipulation
- **Contains**: Subset of data in JSON format
- **Requires**: Custom Java code to import (see Method 4)

---

## Method 1: Import SQL Files via MySQL Command Line

### Step 1: Open Command Prompt/Terminal

Navigate to your project directory:
```bash
cd "C:\Users\Allyssa Ashley Dulay\Documents\Kaabuy\Kaabuy"
```

### Step 2: Login to MySQL

```bash
mysql -h localhost -P 3310 -u root -p
```

Enter your MySQL password when prompted.

### Step 3: Select Database

```sql
USE kaabuy_db;
```

### Step 4: Import the SQL File

For original dataset:
```sql
SOURCE mock_data.sql;
```

For enhanced dataset:
```sql
SOURCE mock_data_enhanced.sql;
```

### Step 5: Verify Import

```sql
SELECT COUNT(*) FROM staff;
SELECT COUNT(*) FROM customers;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM orders;
```

### Step 6: Exit MySQL

```sql
EXIT;
```

---

## Method 2: Import SQL Files via MySQL Workbench

### Step 1: Open MySQL Workbench

1. Launch MySQL Workbench
2. Connect to your database:
   - Hostname: `localhost`
   - Port: `3310`
   - Username: Your MySQL username
   - Password: Your MySQL password

### Step 2: Select Database

1. In the left sidebar, expand your connection
2. Right-click on `kaabuy_db`
3. Select "Set as Default Schema"

### Step 3: Import SQL File

1. Click on **Server** menu → **Data Import**
2. Select **Import from Self-Contained File**
3. Click **Browse** and navigate to:
   - `mock_data.sql` OR
   - `mock_data_enhanced.sql`
4. Under **Default Target Schema**, select `kaabuy_db`
5. Click **Start Import**

### Step 4: Verify Import

Open a new SQL tab and run:
```sql
SELECT COUNT(*) as staff_count FROM staff;
SELECT COUNT(*) as customer_count FROM customers;
SELECT COUNT(*) as product_count FROM products;
SELECT COUNT(*) as order_count FROM orders;
```

---

## Method 3: Import SQL Files via phpMyAdmin

### Step 1: Access phpMyAdmin

Open your web browser and navigate to:
```
http://localhost/phpmyadmin
```

### Step 2: Login and Select Database

1. Login with your MySQL credentials
2. Click on `kaabuy_db` in the left sidebar

### Step 3: Import SQL File

1. Click on the **Import** tab at the top
2. Click **Choose File** button
3. Select either:
   - `mock_data.sql` OR
   - `mock_data_enhanced.sql`
4. Scroll down and click **Go** button

### Step 4: Wait for Import

- The import may take a few seconds
- You should see a success message when complete

### Step 5: Verify Import

1. Click on **SQL** tab
2. Run verification queries:
```sql
SELECT COUNT(*) FROM staff;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM orders;
```

---

## Method 4: Import JSON Data via Java Application

### Step 1: Create Data Import Service

Create a new file: `src/main/java/com/kaabuydev/kaabuy/Services/DataImportService.java`

```java
package com.kaabuydev.kaabuy.Services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kaabuydev.kaabuy.Models.*;
import com.kaabuydev.kaabuy.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.Map;

@Service
public class DataImportService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public void importMockData(String jsonFilePath) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> data = mapper.readValue(
            new File(jsonFilePath),
            Map.class
        );

        // Import staff
        // Import customers
        // Import suppliers
        // Import products
        // etc.

        System.out.println("Mock data imported successfully!");
    }
}
```

### Step 2: Create Import Controller Endpoint

Add to your controller:

```java
@PostMapping("/api/admin/import-mock-data")
public ResponseEntity<?> importMockData() {
    try {
        String jsonPath = "mock_data.json";
        dataImportService.importMockData(jsonPath);
        return ResponseEntity.ok("Mock data imported successfully");
    } catch (Exception e) {
        return ResponseEntity.badRequest()
            .body("Import failed: " + e.getMessage());
    }
}
```

### Step 3: Call the Endpoint

Use Postman or curl:
```bash
curl -X POST http://localhost:8080/api/admin/import-mock-data
```

---

## Verify Import

### Check Record Counts

After importing, verify the data was imported correctly:

#### For Original Dataset (mock_data.sql):
```sql
SELECT 'Staff' as Table_Name, COUNT(*) as Count FROM staff
UNION ALL
SELECT 'Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Suppliers', COUNT(*) FROM suppliers
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Stock Records', COUNT(*) FROM stock_records
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Items', COUNT(*) FROM order_items
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions;
```

**Expected Results**:
- Staff: 3
- Customers: 8
- Suppliers: 5
- Products: 45
- Stock Records: 14
- Orders: 10
- Order Items: 28
- Transactions: 12

#### For Enhanced Dataset (mock_data_enhanced.sql):
**Expected Results**:
- Staff: 8
- Customers: 20
- Suppliers: 10
- Products: 70
- Stock Records: 50+
- Orders: 35
- Order Items: 100+
- Transactions: 45+

### Check Data Integrity

```sql
-- Verify all orders have transactions
SELECT COUNT(*) as orders_without_transactions
FROM orders o
LEFT JOIN transactions t ON o.order_id = t.order_id
WHERE t.transaction_id IS NULL;

-- Should return 0

-- Verify all order items reference valid products
SELECT COUNT(*) as invalid_order_items
FROM order_items oi
LEFT JOIN products p ON oi.product_id = p.product_id
WHERE p.product_id IS NULL;

-- Should return 0
```

### Test Login Credentials

All staff accounts use the same password:
- **Username**: `owner_juan`, `staff_maria`, `staff_pedro`, etc.
- **Password**: `password123`

Try logging in through your application:
```java
// Test authentication
username: owner_juan
password: password123
```

### Check Outstanding Credit (Utang)

For enhanced dataset:
```sql
SELECT
    c.customer_name,
    o.order_id,
    o.total_amount,
    COALESCE(SUM(t.amount), 0) as paid_amount,
    o.total_amount - COALESCE(SUM(t.amount), 0) as remaining_balance
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
LEFT JOIN transactions t ON o.order_id = t.order_id AND t.payment_method = 'PAYMENT'
WHERE o.customer_id IS NOT NULL
GROUP BY o.order_id, c.customer_name, o.total_amount
HAVING remaining_balance > 0
ORDER BY c.customer_name;
```

---

## Troubleshooting

### Error: "Table doesn't exist"

**Solution**: Make sure Hibernate has created the tables first. Start your Spring Boot application:
```bash
./mvnw spring-boot:run
```
Then stop it and run the import again.

### Error: "Duplicate entry for key 'PRIMARY'"

**Solution**: The data has already been imported. Either:
1. Clear the existing data first:
   ```sql
   SET FOREIGN_KEY_CHECKS = 0;
   TRUNCATE TABLE transactions;
   TRUNCATE TABLE order_items;
   TRUNCATE TABLE orders;
   TRUNCATE TABLE stock_records;
   TRUNCATE TABLE products;
   TRUNCATE TABLE suppliers;
   TRUNCATE TABLE customers;
   TRUNCATE TABLE staff;
   SET FOREIGN_KEY_CHECKS = 1;
   ```
2. Or use the data that's already imported

### Error: "Cannot add or update a child row: a foreign key constraint fails"

**Solution**: Import data in the correct order. The SQL files already handle this, but if importing manually via JSON, follow this order:
1. staff
2. customers
3. suppliers
4. products
5. stock_records
6. orders
7. order_items
8. transactions

### Error: "Access denied" or "Connection refused"

**Solution**: Check your database credentials in `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3310/kaabuy_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### Import is Very Slow

**Solution**:
1. Disable foreign key checks during import:
   ```sql
   SET FOREIGN_KEY_CHECKS = 0;
   -- Your import here
   SET FOREIGN_KEY_CHECKS = 1;
   ```
2. Use the SQL files instead of JSON for faster imports

### BCrypt Password Doesn't Work

**Solution**: The hash provided is for `password123`. If your BCrypt configuration differs (different rounds), you may need to regenerate the hash:

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hash = encoder.encode("password123");
System.out.println(hash);
```

---

## Testing Scenarios

After importing the enhanced dataset, you can test these scenarios:

### 1. Customer with Outstanding Credit
- Login as `staff_maria`
- View customer "Aling Nena" - should show ₱100 remaining balance
- Record a payment of ₱50
- Verify balance updated to ₱50

### 2. Low Stock Alert
- View products inventory
- Some products should be at or below reorder level
- Test reorder notifications

### 3. Sales Report
- Generate sales report for last 30 days
- Should show 35 orders with various payment methods
- Total sales should match transaction amounts

### 4. Multiple Staff Activity
- Orders were created by different staff members (IDs 3, 4, 5)
- Test staff activity reports

### 5. Payment Methods Distribution
- Test filtering by Cash, GCash, and Utang payment methods
- Verify transaction summaries

---

## Additional Resources

### Database Schema Diagram
Refer to the exploration report for the complete database relationship diagram.

### Sample Queries

Get all products running low on stock:
```sql
SELECT product_name, current_stock, reorder_level, unit
FROM products
WHERE current_stock <= reorder_level
ORDER BY current_stock ASC;
```

Get customer with highest utang:
```sql
SELECT
    c.customer_name,
    SUM(o.total_amount) as total_credit,
    SUM(COALESCE(p.paid, 0)) as total_paid,
    SUM(o.total_amount) - SUM(COALESCE(p.paid, 0)) as remaining
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
LEFT JOIN (
    SELECT order_id, SUM(amount) as paid
    FROM transactions
    WHERE payment_method = 'PAYMENT'
    GROUP BY order_id
) p ON o.order_id = p.order_id
GROUP BY c.customer_id, c.customer_name
HAVING remaining > 0
ORDER BY remaining DESC;
```

Get daily sales summary:
```sql
SELECT
    DATE(order_date) as date,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_sales
FROM orders
WHERE order_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(order_date)
ORDER BY date DESC;
```

---

## Need Help?

If you encounter any issues not covered in this guide:
1. Check your Spring Boot application logs
2. Verify database connection in application.properties
3. Ensure all dependencies are properly installed
4. Check MySQL error logs for detailed error messages

---

**Last Updated**: December 18, 2025
**Version**: 1.0
**Database**: MySQL 8.0+
**Framework**: Spring Boot 3.x with JPA/Hibernate
