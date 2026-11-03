package com.kaabuydev.kaabuy.Controllers;

import com.kaabuydev.kaabuy.DTO.Authentication.LoginRequest;
import com.kaabuydev.kaabuy.DTO.Authentication.LoginResponse;
import com.kaabuydev.kaabuy.DTO.Authentication.RegisterRequest;
import com.kaabuydev.kaabuy.DTO.Authentication.StaffResponse;
import com.kaabuydev.kaabuy.Models.Staff;
import com.kaabuydev.kaabuy.Services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            Staff staff = authService.register(request);
            StaffResponse response = new StaffResponse(
                    staff.getStaffId(),
                    staff.getUsername(),
                    staff.getFirstName(),
                    staff.getLastName(),
                    staff.getStoreName(),
                    staff.getRole());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/update-credentials")
    public ResponseEntity<?> updateCredentials(
            @Valid @RequestBody com.kaabuydev.kaabuy.DTO.Authentication.ChangeCredentialsRequest request) {
        try {
            String username = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication().getName();
            authService.changeCredentials(username, request);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Credentials updated successfully. Please login with your new credentials.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
