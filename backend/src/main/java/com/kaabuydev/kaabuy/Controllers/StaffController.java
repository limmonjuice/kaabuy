package com.kaabuydev.kaabuy.Controllers;

import com.kaabuydev.kaabuy.DTO.Authentication.StaffResponse;
import com.kaabuydev.kaabuy.DTO.Staff.StaffRequest;
import com.kaabuydev.kaabuy.Exceptions.ResourceNotFoundException;
import com.kaabuydev.kaabuy.Services.StaffService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAuthority('ROLE_owner')")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    // Create new staff
    @PostMapping
    public ResponseEntity<?> createStaff(@Valid @RequestBody StaffRequest request) {
        try {
            StaffResponse response = staffService.createStaff(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all staff
    @GetMapping
    public ResponseEntity<List<StaffResponse>> getAllStaff() {
        List<StaffResponse> staff = staffService.getAllStaff();
        return ResponseEntity.ok(staff);
    }

    // Get staff by ID
    @GetMapping("/{staffId}")
    public ResponseEntity<?> getStaffById(@PathVariable Integer staffId) {
        try {
            StaffResponse response = staffService.getStaffById(staffId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Update staff
    @PutMapping("/{staffId}")
    public ResponseEntity<?> updateStaff(@PathVariable Integer staffId, @Valid @RequestBody StaffRequest request) {
        try {
            StaffResponse response = staffService.updateStaff(staffId, request);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete staff
    @DeleteMapping("/{staffId}")
    public ResponseEntity<?> deleteStaff(@PathVariable Integer staffId) {
        try {
            staffService.deleteStaff(staffId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Staff deleted successfully");
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Update profile (Self)
    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody com.kaabuydev.kaabuy.DTO.Staff.ProfileUpdateRequest request,
            org.springframework.security.core.Authentication authentication) {
        try {
            // Get staffId from the authenticated user (you might need a custom UserDetails
            // implementation or look up by username)
            // Assuming the authentication principal name is the username
            String username = authentication.getName();
            // We need a way to get ID from username. For now, let's add a method in Service
            // or Repository or just look it up.
            // Since we don't have getByUsername exposed easily in Service for ID, let's
            // rely on finding it.
            // A better way is if the Principal contained the ID.
            // Let's compromise: Look up by username in the service logic or add a lookup
            // here.
            // For cleaner code, let's assume we can get it from the service via a new
            // method or modifications.
            // Wait, looking at StaffService, createStaff returns RESPONSE.
            // I'll add `getStaffByUsername` to Service to facilitate this.

            // Actually, let's just pass username to the service method?
            // `updateProfile(String username, ...)`
            // But I already implemented `updateProfile(Integer staffId, ...)`
            // I will use a helper to get ID here.

            // Retrieving Staff ID by username:
            // Since I cannot change Service signature easily without another turn,
            // I will inject StaffRepository here temporarily OR (better) add findByUsername
            // to Service in next step if needed.
            // BUT, I can just modify the Controller to look up the user.
            // Let's rely on `staffService` having a method to finding active staff by
            // username?
            // It has `getAllStaff`.
            // Let's add `updateProfileByUsername` to Service in the next step to be clean?
            // No, I'll just change the signature of `updateProfile` in Service to take a
            // username, or look it up here.

            // To be safe and quick: I'll browse by username in the controller if repository
            // is available? Controller has Service only.
            // Okay, I will add `getStaffByUsername` to Service.
            // For now, I'll place the endpoint here and implementation details.

            // Let's assume I'll add `getStaffIdByUsername` to Service.
            Integer staffId = staffService.getStaffIdByUsername(username);
            StaffResponse response = staffService.updateProfile(staffId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody com.kaabuydev.kaabuy.DTO.Staff.PasswordChangeRequest request,
            org.springframework.security.core.Authentication authentication) {
        try {
            String username = authentication.getName();
            Integer staffId = staffService.getStaffIdByUsername(username);
            staffService.changePassword(staffId, request);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Helper method to build error response
    private ResponseEntity<Map<String, String>> buildErrorResponse(String message, HttpStatus status) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return ResponseEntity.status(status).body(error);
    }
}
