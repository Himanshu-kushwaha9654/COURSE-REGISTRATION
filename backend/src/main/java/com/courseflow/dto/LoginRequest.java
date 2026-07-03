package com.courseflow.dto;

public class LoginRequest {
    private String email;
    private String password;
    private String adminPasskey;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getAdminPasskey() { return adminPasskey; }
    public void setAdminPasskey(String adminPasskey) { this.adminPasskey = adminPasskey; }
}
