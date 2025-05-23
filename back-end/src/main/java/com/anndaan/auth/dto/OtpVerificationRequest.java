package com.anndaan.auth.dto;

import lombok.Data;

@Data
public class OtpVerificationRequest {
    private String email;
    private String phone;
    private String otp;
}
