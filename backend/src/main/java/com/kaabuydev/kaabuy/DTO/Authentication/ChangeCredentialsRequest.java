package com.kaabuydev.kaabuy.DTO.Authentication;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChangeCredentialsRequest {

    @NotBlank(message = "New username is required")
    @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
    private String newUsername;

    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String newPassword;

    public ChangeCredentialsRequest() {
    }

    public ChangeCredentialsRequest(String newUsername, String newPassword) {
        this.newUsername = newUsername;
        this.newPassword = newPassword;
    }

    public String getNewUsername() {
        return newUsername;
    }

    public void setNewUsername(String newUsername) {
        this.newUsername = newUsername;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
