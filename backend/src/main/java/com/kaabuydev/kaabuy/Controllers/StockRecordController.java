package com.kaabuydev.kaabuy.Controllers;

import com.kaabuydev.kaabuy.DTO.StockRecord.StockRecordRequest;
import com.kaabuydev.kaabuy.DTO.StockRecord.StockRecordResponse;
import com.kaabuydev.kaabuy.Services.StockRecordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import java.util.List;

@RestController
@RequestMapping("/api/stock-records")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAuthority('ROLE_owner')")
public class StockRecordController {

    private final StockRecordService stockRecordService;

    public StockRecordController(StockRecordService stockRecordService) {
        this.stockRecordService = stockRecordService;
    }

    @GetMapping
    public ResponseEntity<Page<StockRecordResponse>> getAllStockRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(stockRecordService.getAllStockRecords(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockRecordResponse> getStockRecordById(@PathVariable Integer id) {
        return ResponseEntity.ok(stockRecordService.getStockRecordById(id));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<StockRecordResponse>> getStockRecordsByProduct(@PathVariable Integer productId) {
        return ResponseEntity.ok(stockRecordService.getStockRecordsByProduct(productId));
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<StockRecordResponse>> getStockRecordsBySupplier(@PathVariable Integer supplierId) {
        return ResponseEntity.ok(stockRecordService.getStockRecordsBySupplier(supplierId));
    }

    @PostMapping
    public ResponseEntity<StockRecordResponse> createStockRecord(@RequestBody StockRecordRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(stockRecordService.createStockRecord(request));
    }

    @PostMapping("/batch")
    public ResponseEntity<List<StockRecordResponse>> createStockRecords(
            @RequestBody List<StockRecordRequest> requests) {
        return ResponseEntity.status(HttpStatus.CREATED).body(stockRecordService.createStockRecords(requests));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StockRecordResponse> updateStockRecord(@PathVariable Integer id,
            @RequestBody StockRecordRequest request) {
        return ResponseEntity.ok(stockRecordService.updateStockRecord(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStockRecord(@PathVariable Integer id) {
        stockRecordService.deleteStockRecord(id);
        return ResponseEntity.noContent().build();
    }
}
