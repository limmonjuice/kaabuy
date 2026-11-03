package com.kaabuydev.kaabuy.Services;

import com.kaabuydev.kaabuy.DTO.StockRecord.StockRecordRequest;
import com.kaabuydev.kaabuy.DTO.StockRecord.StockRecordResponse;
import com.kaabuydev.kaabuy.Exceptions.ResourceNotFoundException;
import com.kaabuydev.kaabuy.Models.Product;
import com.kaabuydev.kaabuy.Models.StockRecord;
import com.kaabuydev.kaabuy.Models.Supplier;
import com.kaabuydev.kaabuy.Repositories.ProductRepository;
import com.kaabuydev.kaabuy.Repositories.StockRecordRepository;
import com.kaabuydev.kaabuy.Repositories.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class StockRecordService {

    private final StockRecordRepository stockRecordRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    public StockRecordService(StockRecordRepository stockRecordRepository,
            ProductRepository productRepository,
            SupplierRepository supplierRepository) {
        this.stockRecordRepository = stockRecordRepository;
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
    }

    public Page<StockRecordResponse> getAllStockRecords(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return stockRecordRepository.findAllByOrderByDeliveryDateDescRecordIdDesc(pageable)
                .map(this::mapToResponse);
    }

    public StockRecordResponse getStockRecordById(Integer id) {
        StockRecord stockRecord = stockRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock record not found with id: " + id));
        return mapToResponse(stockRecord);
    }

    public List<StockRecordResponse> getStockRecordsByProduct(Integer productId) {
        return stockRecordRepository.findByProduct_ProductId(productId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<StockRecordResponse> getStockRecordsBySupplier(Integer supplierId) {
        return stockRecordRepository.findBySupplier_SupplierId(supplierId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public StockRecordResponse createStockRecord(StockRecordRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        Supplier supplier = null;
        if (request.getSupplierId() != null) {
            supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Supplier not found with id: " + request.getSupplierId()));
        }

        StockRecord stockRecord = new StockRecord();
        stockRecord.setStockQuantity(request.getStockQuantity());
        stockRecord.setRecordType(request.getRecordType() != null ? request.getRecordType() : "RECEIVED");
        stockRecord.setDeliveryDate(request.getDeliveryDate());
        stockRecord.setPriceSupplier(request.getPriceSupplier());
        stockRecord.setProduct(product);
        stockRecord.setSupplier(supplier);

        // Update product stock based on record type
        updateProductStock(product, request.getRecordType(), request.getStockQuantity());

        // Update supplier statistics if this is a RECEIVED record with a supplier
        if (supplier != null && "RECEIVED".equalsIgnoreCase(request.getRecordType())) {
            supplier.setTotalOrders((supplier.getTotalOrders() != null ? supplier.getTotalOrders() : 0) + 1);
            supplier.setLastOrderDate(
                    request.getDeliveryDate() != null ? request.getDeliveryDate() : java.time.LocalDateTime.now());
            supplierRepository.save(supplier);
        }

        StockRecord saved = stockRecordRepository.save(stockRecord);
        return mapToResponse(saved);
    }

    @Transactional
    public StockRecordResponse updateStockRecord(Integer id, StockRecordRequest request) {
        StockRecord stockRecord = stockRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock record not found with id: " + id));

        Product product = stockRecord.getProduct();
        Supplier oldSupplier = stockRecord.getSupplier();
        String oldRecordType = stockRecord.getRecordType();

        // Revert old stock change
        revertProductStock(product, stockRecord.getRecordType(), stockRecord.getStockQuantity());

        // Revert old supplier statistics if it was a RECEIVED record
        if (oldSupplier != null && "RECEIVED".equalsIgnoreCase(oldRecordType)) {
            oldSupplier.setTotalOrders(
                    Math.max(0, (oldSupplier.getTotalOrders() != null ? oldSupplier.getTotalOrders() : 0) - 1));
            supplierRepository.save(oldSupplier);
        }

        // Update with new product if changed
        if (!stockRecord.getProduct().getProductId().equals(request.getProductId())) {
            productRepository.save(product); // Save reverted stock
            product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found with id: " + request.getProductId()));
            stockRecord.setProduct(product);
        }

        // Update supplier if changed
        Integer currentSupplierId = oldSupplier != null ? oldSupplier.getSupplierId() : null;
        Integer newSupplierId = request.getSupplierId();
        Supplier newSupplier = null;

        if (newSupplierId != null) {
            if (!newSupplierId.equals(currentSupplierId)) {
                newSupplier = supplierRepository.findById(newSupplierId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Supplier not found with id: " + newSupplierId));
                stockRecord.setSupplier(newSupplier);
            } else {
                newSupplier = oldSupplier;
            }
        } else {
            stockRecord.setSupplier(null);
        }

        stockRecord.setStockQuantity(request.getStockQuantity());
        stockRecord.setRecordType(request.getRecordType() != null ? request.getRecordType() : "RECEIVED");
        stockRecord.setDeliveryDate(request.getDeliveryDate());
        stockRecord.setPriceSupplier(request.getPriceSupplier());

        // Apply new stock change
        updateProductStock(product, request.getRecordType(), request.getStockQuantity());

        // Update new supplier statistics if this is a RECEIVED record
        if (newSupplier != null && "RECEIVED".equalsIgnoreCase(request.getRecordType())) {
            newSupplier.setTotalOrders((newSupplier.getTotalOrders() != null ? newSupplier.getTotalOrders() : 0) + 1);
            newSupplier.setLastOrderDate(
                    request.getDeliveryDate() != null ? request.getDeliveryDate() : java.time.LocalDateTime.now());
            supplierRepository.save(newSupplier);
        }

        StockRecord saved = stockRecordRepository.save(stockRecord);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteStockRecord(Integer id) {
        StockRecord stockRecord = stockRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock record not found with id: " + id));

        Product product = stockRecord.getProduct();
        Supplier supplier = stockRecord.getSupplier();

        // Revert the stock change before deleting
        revertProductStock(product, stockRecord.getRecordType(), stockRecord.getStockQuantity());
        productRepository.save(product);

        // Decrement supplier statistics if it was a RECEIVED record
        if (supplier != null && "RECEIVED".equalsIgnoreCase(stockRecord.getRecordType())) {
            supplier.setTotalOrders(
                    Math.max(0, (supplier.getTotalOrders() != null ? supplier.getTotalOrders() : 0) - 1));
            supplierRepository.save(supplier);
        }

        stockRecordRepository.delete(stockRecord);
    }

    private void updateProductStock(Product product, String recordType, Integer quantity) {
        int currentStock = product.getCurrentStock() != null ? product.getCurrentStock() : 0;

        switch (recordType != null ? recordType.toUpperCase() : "RECEIVED") {
            case "RECEIVED":
            case "IN":
            case "RESTOCK":
                product.setCurrentStock(currentStock + quantity);
                break;
            case "WITHDRAWN":
            case "OUT":
                int newStock = currentStock - quantity;
                if (newStock < 0) {
                    throw new IllegalArgumentException(
                            "Insufficient stock. Current stock: " + currentStock + ", requested: " + quantity);
                }
                product.setCurrentStock(newStock);
                break;
            default:
                product.setCurrentStock(currentStock + quantity);
        }

        // Update low stock flag
        product.setIsLowStock(product.getCurrentStock() <= product.getReorderLevel());
        productRepository.save(product);
    }

    private void revertProductStock(Product product, String recordType, Integer quantity) {
        int currentStock = product.getCurrentStock() != null ? product.getCurrentStock() : 0;

        switch (recordType != null ? recordType.toUpperCase() : "RECEIVED") {
            case "RECEIVED":
            case "IN":
            case "RESTOCK":
                product.setCurrentStock(currentStock - quantity);
                break;
            case "WITHDRAWN":
            case "OUT":
                product.setCurrentStock(currentStock + quantity);
                break;
            default:
                product.setCurrentStock(currentStock - quantity);
        }

        // Update low stock flag
        product.setIsLowStock(product.getCurrentStock() <= product.getReorderLevel());
    }

    private StockRecordResponse mapToResponse(StockRecord stockRecord) {
        return new StockRecordResponse(
                stockRecord.getRecordId(),
                stockRecord.getStockQuantity(),
                stockRecord.getRecordType(),
                stockRecord.getDeliveryDate(),
                stockRecord.getPriceSupplier(),
                stockRecord.getSupplier() != null ? stockRecord.getSupplier().getSupplierId() : null,
                stockRecord.getSupplier() != null ? stockRecord.getSupplier().getSupplierName() : null,
                stockRecord.getProduct().getProductId(),
                stockRecord.getProduct().getProductName());
    }

    @Transactional
    public List<StockRecordResponse> createStockRecords(List<StockRecordRequest> requests) {
        return requests.stream()
                .map(this::createStockRecord)
                .collect(Collectors.toList());
    }
}
