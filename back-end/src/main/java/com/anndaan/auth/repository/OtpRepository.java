package com.anndaan.auth.repository;

import com.anndaan.auth.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    
    Optional<Otp> findByEmailAndVerifiedFalse(String email);
    
    Optional<Otp> findByPhoneAndVerifiedFalse(String phone);
    
    Optional<Otp> findByEmailAndOtpAndVerifiedFalse(String email, String otp);
    
    Optional<Otp> findByPhoneAndOtpAndVerifiedFalse(String phone, String otp);
}
