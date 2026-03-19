package com.spincoders.cropmaster.dto;

public class LoginResponse {

    private final String message;
    private final String token;
    private final String nic;
    private final String role;

    public LoginResponse(String message, String token, String nic, String role) {
        this.message = message;
        this.token = token;
        this.nic = nic;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }

    public String getNic() {
        return nic;
    }

    public String getRole() {
        return role;
    }
}
