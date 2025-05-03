package com.anndaan.backend.service;

import com.anndaan.backend.entity.Restaurant;
import com.anndaan.backend.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RestaurantService implements UserDetailsService {
    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Restaurant register(Restaurant restaurant) {
        restaurant.setPassword(passwordEncoder.encode(restaurant.getPassword()));
        return restaurantRepository.save(restaurant);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Restaurant restaurant = restaurantRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return User.builder()
                .username(restaurant.getEmail())
                .password(restaurant.getPassword())
                .roles("RESTAURANT")
                .build();
    }
}