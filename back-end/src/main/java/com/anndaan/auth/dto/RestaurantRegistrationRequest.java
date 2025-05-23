package com.anndaan.auth.dto;

import lombok.Data;

@Data
public class RestaurantRegistrationRequest {
    private String restaurantName;
    private String ownerName;
    private String email;
    private String phone;
    private String password;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String description;
}
