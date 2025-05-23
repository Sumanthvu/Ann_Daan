package com.anndaan.auth.service;

import com.anndaan.auth.dto.*;
import com.anndaan.auth.entity.Otp;
import com.anndaan.auth.entity.Restaurant;
import com.anndaan.auth.repository.OtpRepository;
import com.anndaan.auth.repository.RestaurantRepository;
import com.anndaan.auth.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SmsService smsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public ApiResponse sendOtp(OtpRequest request) {
        String identifier = request.getEmail() != null ? request.getEmail() : request.getPhone();
        String otpValue = generateOtp();
        
        // Save OTP to database
        Otp otp = Otp.builder()
                .email(request.getEmail())
                .phone(request.getPhone())
                .otp(otpValue)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .verified(false)
                .build();
        
        // Check if there's an existing OTP for this email/phone
        if (request.getEmail() != null) {
            Optional<Otp> existingOtp = otpRepository.findByEmailAndVerifiedFalse(request.getEmail());
            existingOtp.ifPresent(otpRepository::delete);
        } else if (request.getPhone() != null) {
            Optional<Otp> existingOtp = otpRepository.findByPhoneAndVerifiedFalse(request.getPhone());
            existingOtp.ifPresent(otpRepository::delete);
        }
        
        otpRepository.save(otp);
        
        // Send OTP via email or SMS
        if (request.getEmail() != null) {
            emailService.sendOtpEmail(request.getEmail(), otpValue);
        } else if (request.getPhone() != null) {
            smsService.sendOtpSms(request.getPhone(), otpValue);
        }
        
        return ApiResponse.success("OTP sent successfully to " + identifier);
    }

    public ApiResponse verifyOtp(OtpVerificationRequest request) {
        Optional<Otp> otpOptional;
        
        if (request.getEmail() != null) {
            otpOptional = otpRepository.findByEmailAndOtpAndVerifiedFalse(request.getEmail(), request.getOtp());
        } else {
            otpOptional = otpRepository.findByPhoneAndOtpAndVerifiedFalse(request.getPhone(), request.getOtp());
        }
        
        if (otpOptional.isEmpty()) {
            return ApiResponse.error("Invalid OTP");
        }
        
        Otp otp = otpOptional.get();
        
        // Check if OTP is expired
        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            return ApiResponse.error("OTP has expired");
        }
        
        // Mark OTP as verified
        otp.setVerified(true);
        otpRepository.save(otp);
        
        return ApiResponse.success("OTP verified successfully");
    }

    public ApiResponse login(LoginRequest request) {
        Optional<Restaurant> restaurantOptional;
        
        if (request.getEmail() != null) {
            restaurantOptional = restaurantRepository.findByEmail(request.getEmail());
        } else {
            restaurantOptional = restaurantRepository.findByPhone(request.getPhone());
        }
        
        if (restaurantOptional.isEmpty()) {
            return ApiResponse.error("Invalid credentials");
        }
        
        Restaurant restaurant = restaurantOptional.get();
        
        // Check password
        if (!passwordEncoder.matches(request.getPassword(), restaurant.getPassword())) {
            return ApiResponse.error("Invalid credentials");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(restaurant.getId().toString(), restaurant.getEmail());
        
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", restaurant);
        
        return ApiResponse.success("Login successful", data);
    }

    public ApiResponse resetPassword(ResetPasswordRequest request) {
        Optional<Restaurant> restaurantOptional;
        
        if (request.getEmail() != null) {
            restaurantOptional = restaurantRepository.findByEmail(request.getEmail());
        } else {
            restaurantOptional = restaurantRepository.findByPhone(request.getPhone());
        }
        
        if (restaurantOptional.isEmpty()) {
            return ApiResponse.error("User not found");
        }
        
        Restaurant restaurant = restaurantOptional.get();
        
        // Update password
        restaurant.setPassword(passwordEncoder.encode(request.getPassword()));
        restaurantRepository.save(restaurant);
        
        return ApiResponse.success("Password reset successfully");
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
