package com.kaabuydev.kaabuy.Services;

import com.kaabuydev.kaabuy.DTO.Authentication.ChangeCredentialsRequest;
import com.kaabuydev.kaabuy.DTO.Authentication.LoginRequest;
import com.kaabuydev.kaabuy.DTO.Authentication.LoginResponse;
import com.kaabuydev.kaabuy.DTO.Authentication.RegisterRequest;
import com.kaabuydev.kaabuy.Models.Staff;
import com.kaabuydev.kaabuy.Repositories.StaffRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    private final AuthenticationManager authenticationManager;

    public AuthService(StaffRepository staffRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenService jwtTokenService,
            AuthenticationManager authenticationManager) {
        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
        this.authenticationManager = authenticationManager;
    }

    public Staff register(RegisterRequest request) {
        // ✅ CHANGED: Only check if username exists among ACTIVE users
        if (staffRepository.findByUsernameAndIsActiveTrue(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        Staff staff = new Staff();
        staff.setUsername(request.getUsername());
        staff.setPassword(passwordEncoder.encode(request.getPassword()));
        staff.setFirstName(request.getFirstName());
        staff.setLastName(request.getLastName());
        staff.setStoreName(request.getStoreName());

        // All users who register become owners
        // Owners can create staff accounts through Staff management page
        staff.setRole("owner");
        staff.setActive(true);

        return staffRepository.save(staff);
    }

    public LoginResponse login(LoginRequest request) {
        // ✅ CHANGED: Use findByUsernameAndIsActiveTrue to check active users only
        Staff staff = staffRepository.findByUsernameAndIsActiveTrue(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials or account is inactive"));

        // No need for separate isActive check since we used
        // findByUsernameAndIsActiveTrue

        // Now authenticate
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        String token = jwtTokenService.generateToken(authentication);

        return new LoginResponse(
                token,
                staff.getStaffId(),
                staff.getUsername(),
                staff.getFirstName(),
                staff.getLastName(),
                staff.getStoreName(),
                staff.getRole(),
                staff.isRequiresPasswordChange());
    }

    public void changeCredentials(String currentUsername, ChangeCredentialsRequest request) {
        Staff staff = staffRepository.findByUsernameAndIsActiveTrue(currentUsername)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        // Check if new username is unique
        if (!staff.getUsername().equals(request.getNewUsername()) &&
                staffRepository.findByUsernameAndIsActiveTrue(request.getNewUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        staff.setUsername(request.getNewUsername());
        staff.setPassword(passwordEncoder.encode(request.getNewPassword()));
        staff.setRequiresPasswordChange(false);

        staffRepository.save(staff);
    }
}
