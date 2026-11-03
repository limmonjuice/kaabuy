package com.kaabuydev.kaabuy.Repositories;

import com.kaabuydev.kaabuy.Models.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {

        // Authentication
        Optional<Staff> findByUsername(String username);

        Boolean existsByUsername(String username);

        // Find by role
        List<Staff> findByRole(String role);

        // Search by name
        List<Staff> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                        String firstName, String lastName);

        // ✅ ADD THESE FOR SOFT DELETE SUPPORT
        List<Staff> findByIsActiveTrue(); // Get only active staff

        Optional<Staff> findByUsernameAndIsActiveTrue(String username); // For login - only active users

        Optional<Staff> findByEmailAndIsActiveTrue(String email); // For email uniqueness check (Trigger Recompile)

        List<Staff> findByRoleAndIsActiveTrue(String role); // Get active staff by role

        List<Staff> findByIsActiveTrueAndFirstNameContainingIgnoreCaseOrIsActiveTrueAndLastNameContainingIgnoreCase(
                        String firstName, String lastName); // Search only active staff by name
}