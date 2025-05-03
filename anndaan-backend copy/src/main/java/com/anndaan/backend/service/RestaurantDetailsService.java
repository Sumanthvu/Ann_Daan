package com.anndaan.backend.service;

import com.anndaan.backend.entity.Restaurant;
import com.anndaan.backend.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.User;

@Service
public class RestaurantDetailsService implements UserDetailsService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Restaurant restaurant = restaurantRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Restaurant not found with email: " + email));
        return User.withUsername(restaurant.getEmail())
                   .password(restaurant.getPassword())
                   .authorities("RESTAURANT")
                   .build();
    }
}
