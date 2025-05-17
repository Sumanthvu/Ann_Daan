package com.anndaan.service;

import com.anndaan.dto.AuthRequest;
import com.anndaan.dto.AuthResponse;

public interface AuthService {
    AuthResponse login(AuthRequest authRequest);
}