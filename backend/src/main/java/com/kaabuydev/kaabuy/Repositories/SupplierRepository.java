package com.kaabuydev.kaabuy.Repositories;

import com.kaabuydev.kaabuy.Models.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {

       // Search by supplier name (case-insensitive)
       List<Supplier> findBySupplierNameContainingIgnoreCase(String supplierName);

       // Find preferred suppliers
       List<Supplier> findByIsPreferredTrue();

       // Search suppliers by name, contact person, or address
       @Query("SELECT s FROM Supplier s WHERE LOWER(s.supplierName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                     "OR LOWER(s.contactPerson) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                     "OR LOWER(s.address) LIKE LOWER(CONCAT('%', :keyword, '%'))")
       List<Supplier> searchSuppliers(@Param("keyword") String keyword);

       // Check if supplier name exists (for duplicate validation)
       Boolean existsBySupplierNameIgnoreCase(String supplierName);

       // Check if supplier name exists excluding a specific supplier (for update
       // validation)
       @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Supplier s " +
                     "WHERE LOWER(s.supplierName) = LOWER(:supplierName) AND s.supplierId != :supplierId")
       Boolean existsBySupplierNameIgnoreCaseAndSupplierIdNot(@Param("supplierName") String supplierName,
                     @Param("supplierId") Integer supplierId);

       // Count preferred suppliers
       @Query("SELECT COUNT(s) FROM Supplier s WHERE s.isPreferred = true")
       Long countPreferredSuppliers();

       // Find suppliers ordered by total orders (most orders first)
       @Query("SELECT s FROM Supplier s ORDER BY s.totalOrders DESC")
       List<Supplier> findAllOrderByTotalOrdersDesc();

       // Find suppliers ordered by last order date (most recent first)
       @Query("SELECT s FROM Supplier s WHERE s.lastOrderDate IS NOT NULL ORDER BY s.lastOrderDate DESC")
       List<Supplier> findAllOrderByLastOrderDateDesc();

       // Sum of total orders across all suppliers (Trigger Rebuild)
       @Query("SELECT COALESCE(SUM(s.totalOrders), 0) FROM Supplier s")
       Long sumTotalOrders();
}
