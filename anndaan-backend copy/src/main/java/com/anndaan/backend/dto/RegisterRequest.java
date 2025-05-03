package com.anndaan.backend.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class RegisterRequest {
    @NotBlank
    private String name;
    @Email @NotBlank
    private String email;
    @NotBlank
    private String password;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String phoneNumber;
    private String description;
    private String cuisineType;
    private String openingHours;
    // Getters and Setters
}