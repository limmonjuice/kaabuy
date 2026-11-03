package com.kaabuydev.kaabuy.Models;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "staff")
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer staffId;

    @Column(nullable = false, length = 100)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(length = 200)
    private String storeName;

    @Column(nullable = false, length = 50)
    private String role;

    // ✅ ADD THIS FIELD
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(length = 150)
    private String email;

    @Column(name = "requires_password_change", nullable = false)
    private boolean requiresPasswordChange = false;

    // Staff (1) - processes - Order (many)
    @OneToMany(mappedBy = "staff", fetch = FetchType.LAZY)
    private List<Order> orders;

    public Staff() {
    }

    public Staff(Integer staffId, String username, String password,
            String firstName, String lastName, String storeName, String role) {
        this.staffId = staffId;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.storeName = storeName;
        this.role = role;
        this.isActive = true; // ✅ Default to active
    }

    public Integer getStaffId() {
        return staffId;
    }

    public void setStaffId(Integer staffId) {
        this.staffId = staffId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // ✅ ADD GETTER AND SETTER FOR isActive
    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isRequiresPasswordChange() {
        return requiresPasswordChange;
    }

    public void setRequiresPasswordChange(boolean requiresPasswordChange) {
        this.requiresPasswordChange = requiresPasswordChange;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
}