package com.anndaan.backend.controller;

import com.anndaan.backend.entity.Restaurant;
import com.anndaan.backend.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/restaurant")
public class RestaurantController {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        String email = auth.getName();
        Optional<Restaurant> restaurant = restaurantRepository.findByEmail(email);
        return restaurant.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication auth, @RequestBody Restaurant updated) {
        String email = auth.getName();
        Optional<Restaurant> optional = restaurantRepository.findByEmail(email);
        if (!optional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Restaurant restaurant = optional.get();
        // Update fields (excluding email and password for simplicity)
        restaurant.setName(updated.getName());
        restaurant.setAddress(updated.getAddress());
        restaurant.setCity(updated.getCity());
        restaurant.setState(updated.getState());
        restaurant.setZipCode(updated.getZipCode());
        restaurant.setPhoneNumber(updated.getPhoneNumber());
        restaurant.setDescription(updated.getDescription());
        restaurant.setCuisineType(updated.getCuisineType());
        restaurant.setOpeningHours(updated.getOpeningHours());
        restaurantRepository.save(restaurant);
        return ResponseEntity.ok("Profile updated successfully");
    }
}
