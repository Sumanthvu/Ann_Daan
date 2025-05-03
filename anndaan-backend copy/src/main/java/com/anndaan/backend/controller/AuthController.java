package com.anndaan.backend.controller;

import com.anndaan.backend.entity.Restaurant;
import com.anndaan.backend.repository.RestaurantRepository;
import com.anndaan.backend.config.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerRestaurant(@Valid @RequestBody Restaurant restaurant, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body("Invalid data provided");
        }
        if (restaurantRepository.existsByEmail(restaurant.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }
        restaurant.setPassword(passwordEncoder.encode(restaurant.getPassword()));
        restaurantRepository.save(restaurant);
        return ResponseEntity.ok("Restaurant registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateRestaurant(@Valid @RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        String token = jwtUtils.generateToken(
                org.springframework.security.core.userdetails.User.withUsername(loginRequest.getEmail()).password("").authorities("RESTAURANT").build());
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }
}
