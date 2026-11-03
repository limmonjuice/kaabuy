package com.kaabuydev.kaabuy.Controllers;

import com.kaabuydev.kaabuy.DTO.Dashboard.DashboardStats;
import com.kaabuydev.kaabuy.Services.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // Get complete dashboard statistics (optionally for a specific date)
    @GetMapping
    public ResponseEntity<DashboardStats> getDashboardStats(
            @RequestParam(required = false) String date) {
        LocalDate targetDate = date != null ? LocalDate.parse(date) : LocalDate.now();
        DashboardStats stats = dashboardService.getDashboardStats(targetDate);
        return ResponseEntity.ok(stats);
    }

    // Get sales summary only
    @GetMapping("/sales")
    public ResponseEntity<Map<String, Object>> getSalesSummary() {
        Map<String, Object> summary = dashboardService.getSalesSummary();
        return ResponseEntity.ok(summary);
    }

    // Get inventory alerts (low stock, out of stock)
    @GetMapping("/inventory-alerts")
    public ResponseEntity<Map<String, Object>> getInventoryAlerts() {
        Map<String, Object> alerts = dashboardService.getInventoryAlerts();
        return ResponseEntity.ok(alerts);
    }

    // Get utang (credit) summary
    @GetMapping("/utang")
    public ResponseEntity<Map<String, Object>> getUtangSummary() {
        Map<String, Object> summary = dashboardService.getUtangSummary();
        return ResponseEntity.ok(summary);
    }

    // Get sales chart data for different periods (today, week, month, year)
    @GetMapping("/sales-chart")
    public ResponseEntity<List<Map<String, Object>>> getSalesChartData(@RequestParam String period) {
        List<Map<String, Object>> chartData = dashboardService.getSalesChartData(period);
        return ResponseEntity.ok(chartData);
    }
}
