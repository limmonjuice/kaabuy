package com.kaabuydev.kaabuy.DTO.Authentication;

public class LoginResponse {

    private String token;
    private String tokenType = "Bearer";
    private Integer staffId;
    private String username;
    private String firstName;
    private String lastName;
    private String storeName;
    private String role;
    private boolean requiresPasswordChange;

    // All-args constructor
    public LoginResponse(String token, Integer staffId, String username,
            String firstName, String lastName, String storeName, String role, boolean requiresPasswordChange) {
        this.token = token;
        this.staffId = staffId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.storeName = storeName;
        this.role = role;
        this.requiresPasswordChange = requiresPasswordChange;
    }

    // Getters & Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
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

    public boolean isRequiresPasswordChange() {
        return requiresPasswordChange;
    }

    public void setRequiresPasswordChange(boolean requiresPasswordChange) {
        this.requiresPasswordChange = requiresPasswordChange;
    }
}
