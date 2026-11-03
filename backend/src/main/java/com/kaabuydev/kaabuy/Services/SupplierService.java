package com.kaabuydev.kaabuy.Services;

import com.kaabuydev.kaabuy.DTO.Supplier.SupplierRequest;
import com.kaabuydev.kaabuy.DTO.Supplier.SupplierResponse;
import com.kaabuydev.kaabuy.Exceptions.ResourceNotFoundException;
import com.kaabuydev.kaabuy.Models.Supplier;
import com.kaabuydev.kaabuy.Repositories.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    // Create a new supplier
    public SupplierResponse createSupplier(SupplierRequest request) {
        // Check if supplier name already exists
        if (supplierRepository.existsBySupplierNameIgnoreCase(request.getSupplierName())) {
            throw new RuntimeException("Supplier with name '" + request.getSupplierName() + "' already exists");
        }

        Supplier supplier = new Supplier();
        mapRequestToSupplier(request, supplier);
        supplier.setTotalOrders(0);

        Supplier savedSupplier = supplierRepository.save(supplier);
        return mapToResponse(savedSupplier);
    }

    // Get all suppliers (Newest First)
    public List<SupplierResponse> getAllSuppliers() {
        return supplierRepository.findAll()
                .stream()
                .sorted((s1, s2) -> s2.getSupplierId().compareTo(s1.getSupplierId())) // Sort by ID desc
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get supplier by ID
    public SupplierResponse getSupplierById(Integer supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "supplierId", supplierId));
        return mapToResponse(supplier);
    }

    // Update supplier
    public SupplierResponse updateSupplier(Integer supplierId, SupplierRequest request) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "supplierId", supplierId));

        // Check if supplier name already exists for another supplier
        if (supplierRepository.existsBySupplierNameIgnoreCaseAndSupplierIdNot(request.getSupplierName(), supplierId)) {
            throw new RuntimeException("Supplier with name '" + request.getSupplierName() + "' already exists");
        }

        mapRequestToSupplier(request, supplier);

        Supplier updatedSupplier = supplierRepository.save(supplier);
        return mapToResponse(updatedSupplier);
    }

    // Delete supplier
    public void deleteSupplier(Integer supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "supplierId", supplierId));
        supplierRepository.delete(supplier);
    }

    // Search suppliers by keyword (name, contact person, or address)
    public List<SupplierResponse> searchSuppliers(String keyword) {
        return supplierRepository.searchSuppliers(keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get preferred suppliers
    public List<SupplierResponse> getPreferredSuppliers() {
        return supplierRepository.findByIsPreferredTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Toggle preferred status
    public SupplierResponse togglePreferred(Integer supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "supplierId", supplierId));

        supplier.setIsPreferred(!supplier.getIsPreferred());

        Supplier updatedSupplier = supplierRepository.save(supplier);
        return mapToResponse(updatedSupplier);
    }

    // Record a new order from supplier (for restocking)
    public SupplierResponse recordOrder(Integer supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "supplierId", supplierId));

        supplier.setLastOrderDate(LocalDateTime.now());
        supplier.setTotalOrders(supplier.getTotalOrders() + 1);

        Supplier updatedSupplier = supplierRepository.save(supplier);
        return mapToResponse(updatedSupplier);
    }

    // Get supplier summary
    public Map<String, Object> getSupplierSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalSuppliers", supplierRepository.count());
        summary.put("preferredSuppliers", supplierRepository.countPreferredSuppliers());
        summary.put("totalOrders", supplierRepository.sumTotalOrders());
        return summary;
    }

    // Get suppliers ordered by total orders
    public List<SupplierResponse> getSuppliersByTotalOrders() {
        return supplierRepository.findAllOrderByTotalOrdersDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get suppliers ordered by last order date
    public List<SupplierResponse> getSuppliersByRecentOrders() {
        return supplierRepository.findAllOrderByLastOrderDateDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Helper method to map request to supplier entity
    private void mapRequestToSupplier(SupplierRequest request, Supplier supplier) {
        supplier.setSupplierName(request.getSupplierName());
        supplier.setContactPerson(request.getContactPerson());
        supplier.setContactNumber(request.getContactNumber());
        supplier.setAddress(request.getAddress());
        supplier.setIsPreferred(request.getIsPreferred() != null ? request.getIsPreferred() : false);
    }

    // Helper method to map supplier entity to response
    private SupplierResponse mapToResponse(Supplier supplier) {
        return new SupplierResponse(
                supplier.getSupplierId(),
                supplier.getSupplierName(),
                supplier.getContactPerson(),
                supplier.getContactNumber(),
                supplier.getAddress(),
                supplier.getLastOrderDate(),
                supplier.getTotalOrders(),
                supplier.getIsPreferred());
    }
}
