package com.anndaan.controller;

import com.anndaan.dto.AuthRequest;
import com.anndaan.dto.AuthResponse;
import com.anndaan.entity.Restaurant;
import com.anndaan.repository.RestaurantRepository;
import com.anndaan.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public String register(@RequestBody Restaurant restaurant) {
        restaurant.setPassword(passwordEncoder.encode(restaurant.getPassword()));
        restaurantRepository.save(restaurant);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String token = jwtTokenProvider.generateToken((org.springframework.security.core.userdetails.User) authentication.getPrincipal());
        return new AuthResponse(token);
    }
}