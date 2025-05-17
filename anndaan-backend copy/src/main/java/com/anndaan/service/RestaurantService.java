package com.anndaan.service;

import com.anndaan.dto.RestaurantRegistrationDto;
import com.anndaan.model.Restaurant;

public interface RestaurantService {
    Restaurant registerRestaurant(RestaurantRegistrationDto registrationDto);
    Restaurant getRestaurantById(Long id);
}