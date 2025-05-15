// src/main/java/com/example/backend/dto/JwtResponse.java
package com.example.backend.dto;

public class JwtResponse {
    private String token;
    private Long userId;

    public JwtResponse() { }

    public JwtResponse(String token, Long userId) {
        this.token = token;
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
