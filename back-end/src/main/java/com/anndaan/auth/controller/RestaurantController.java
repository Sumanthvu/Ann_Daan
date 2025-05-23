package com.anndaan.auth.controller;

import com.anndaan.auth.dto.ApiResponse;
import com.anndaan.auth.dto.RestaurantRegistrationRequest;
import com.anndaan.auth.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerRestaurant(@RequestBody RestaurantRegistrationRequest request) {
        return ResponseEntity.ok(restaurantService.registerRestaurant(request));
    }
}
