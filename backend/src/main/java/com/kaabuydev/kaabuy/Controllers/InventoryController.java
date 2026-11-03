package com.kaabuydev.kaabuy.Controllers;

import com.kaabuydev.kaabuy.DTO.Inventory.InventoryResponse;
import com.kaabuydev.kaabuy.Services.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyAuthority('ROLE_owner', 'ROLE_staff')")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // Get all stock levels
    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAllStock() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    // Get low stock warnings
    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryResponse>> getLowStock() {
        return ResponseEntity.ok(inventoryService.getLowStockProducts());
    }

    // Get out of stock items
    @GetMapping("/out-of-stock")
    public ResponseEntity<List<InventoryResponse>> getOutOfStock() {
        return ResponseEntity.ok(inventoryService.getOutOfStockProducts());
    }

    // Get inventory summary
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(inventoryService.getStockSummary());
    }
}
