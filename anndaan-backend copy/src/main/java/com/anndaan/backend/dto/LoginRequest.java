package com.anndaan.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @Email
    private String email;

    @NotBlank
    private String password;

    // getters and setters
}
