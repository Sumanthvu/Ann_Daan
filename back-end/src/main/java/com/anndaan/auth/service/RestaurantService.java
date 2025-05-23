package com.anndaan.auth.service;

import com.anndaan.auth.dto.ApiResponse;
import com.anndaan.auth.dto.RestaurantRegistrationRequest;
import com.anndaan.auth.entity.Restaurant;
import com.anndaan.auth.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ApiResponse registerRestaurant(RestaurantRegistrationRequest request) {
        // Check if email already exists
        if (restaurantRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.error("Email already registered");
        }
        
        // Check if phone already exists
        if (restaurantRepository.existsByPhone(request.getPhone())) {
            return ApiResponse.error("Phone number already registered");
        }
        
        // Create new restaurant
        Restaurant restaurant = Restaurant.builder()
                .restaurantName(request.getRestaurantName())
                .ownerName(request.getOwnerName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .description(request.getDescription())
                .build();
        
        restaurantRepository.save(restaurant);
        
        return ApiResponse.success("Restaurant registered successfully");
    }
}
