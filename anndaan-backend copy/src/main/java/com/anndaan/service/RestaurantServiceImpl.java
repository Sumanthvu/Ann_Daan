package com.anndaan.service;

import com.anndaan.dto.RestaurantRegistrationDto;
import com.anndaan.model.Restaurant;
import com.anndaan.model.User;
import com.anndaan.repository.RestaurantRepository;
import com.anndaan.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Restaurant registerRestaurant(RestaurantRegistrationDto registrationDto) {
        // Check if username already exists
        if (userRepository.existsByUsername(registrationDto.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        // Check if email already exists
        if (restaurantRepository.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        // Create user
        User user = new User();
        user.setUsername(registrationDto.getUsername());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setRole("ROLE_RESTAURANT");

        // Create restaurant
        Restaurant restaurant = new Restaurant();
        restaurant.setName(registrationDto.getName());
        restaurant.setAddress(registrationDto.getAddress());
        restaurant.setCity(registrationDto.getCity());
        restaurant.setState(registrationDto.getState());
        restaurant.setPincode(registrationDto.getPincode());
        restaurant.setContactNumber(registrationDto.getContactNumber());
        restaurant.setEmail(registrationDto.getEmail());
        restaurant.setDescription(registrationDto.getDescription());
        restaurant.setCuisineType(registrationDto.getCuisineType());
        restaurant.setOpeningHours(registrationDto.getOpeningHours());
        
        // Set bidirectional relationship
        restaurant.setUser(user);
        user.setRestaurant(restaurant);
        
        // Save user which will cascade to restaurant
        userRepository.save(user);
        
        return restaurant;
    }

    @Override
    public Restaurant getRestaurantById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }
}