package com.kaabuydev.kaabuy.DTO.Authentication;

public class StaffResponse {

    private Integer staffId;
    private String username;
    private String firstName;
    private String lastName;
    private String storeName;
    private String role;

    public StaffResponse() {}

    public StaffResponse(Integer staffId, String username, String firstName,
                        String lastName, String storeName, String role) {
        this.staffId = staffId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.storeName = storeName;
        this.role = role;
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
}
