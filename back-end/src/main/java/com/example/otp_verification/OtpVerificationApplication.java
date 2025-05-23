package com.example.otp_verification;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.HashMap;

// --- Entity, Repository, DTO classes ---
@Entity
@Table(name = "app_users", uniqueConstraints = {@UniqueConstraint(columnNames = "email")})
@Getter @Setter @NoArgsConstructor
class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String fullName;
    @Column(nullable = false, unique = true) private String email;
    @Column(nullable = false) private String mobile;
    @Column(nullable = false) private String password; // Hashed
    private String gender;
    private String role;
    private String education;
}

@Repository
interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

@Getter @Setter
class SignupRequestDto {
    private String fullName;
    private String email;
    private String mobile;
    private String gender;
    private String role;
    private String education;
    private String password;
}

@Getter @Setter
class LoginRequestDto {
    private String email;
    private String password;
}

// --- Main Application Class ---
@SpringBootApplication
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow requests from any origin for development
public class OtpVerificationApplication {

    private static final Logger logger = LoggerFactory.getLogger(OtpVerificationApplication.class);
    private static final int OTP_EXPIRY_MINUTES = 5;

    // --- Dependencies ---
    @Autowired private JavaMailSender mailSender;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // --- OTP Storage ---
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final Map<String, Long> otpTimestamps = new ConcurrentHashMap<>();

    // --- Main Method ---
    public static void main(String[] args) {
        SpringApplication.run(OtpVerificationApplication.class, args);
        logger.info("Ann Daan Application Started!");
        logger.info("H2 Console available at http://localhost:8080/h2-console");
    }

    // --- Configuration ---
    @Configuration
    static class AppConfig {
        @Bean
        public PasswordEncoder passwordEncoderBean() {
            return new BCryptPasswordEncoder();
        }

        @Bean
        public SecurityFilterChain filterChainBean(HttpSecurity http) throws Exception {
            http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configure(http))
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/**", "/h2-console/**").permitAll()
                    .anyRequest().authenticated()
                )
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()));
            return http.build();
        }
        
        @Bean
        public WebMvcConfigurer corsConfigurer() {
            return new WebMvcConfigurer() {
                @Override
                public void addCorsMappings(CorsRegistry registry) {
                    registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
                }
            };
        }
    }

    // --- OTP Service Logic ---
    private String generateOtpValue() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
    
    private void sendOtpEmailInternal(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Your Ann Daan Verification Code");
            message.setText("Welcome to Ann Daan! Your OTP code is: " + otp +
                    "\nIt is valid for " + OTP_EXPIRY_MINUTES + " minutes.");
            mailSender.send(message);
            logger.info("OTP email sent to {}", toEmail);
        } catch (Exception e) {
            logger.error("Error sending OTP email to {}: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to send OTP email.", e);
        }
    }
    
    public boolean generateAndSendOtp(String email) {
        String otp = generateOtpValue();
        long timestamp = System.currentTimeMillis();
        otpStorage.put(email, otp);
        otpTimestamps.put(email, timestamp);
        logger.info("Generated OTP for email {}", email);

        try {
            sendOtpEmailInternal(email, otp);
            logger.info("OTP email sent successfully for {}", email);
            return true;
        } catch (RuntimeException e) {
            otpStorage.remove(email);
            otpTimestamps.remove(email);
            logger.error("Failed to send OTP for {} due to: {}", email, e.getMessage());
            return false;
        }
    }
    
    public boolean verifyOtp(String email, String submittedOtp) {
        String storedOtp = otpStorage.get(email);
        Long storedTimestamp = otpTimestamps.get(email);
        
        if (storedOtp == null || storedTimestamp == null) {
            logger.warn("No OTP found for email: {}", email);
            return false;
        }
        
        long currentTime = System.currentTimeMillis();
        long timeElapsed = currentTime - storedTimestamp;
        
        if (TimeUnit.MILLISECONDS.toMinutes(timeElapsed) >= OTP_EXPIRY_MINUTES) {
            logger.warn("OTP expired for email: {}", email);
            otpStorage.remove(email);
            otpTimestamps.remove(email);
            return false;
        }
        
        if (storedOtp.equals(submittedOtp)) {
            logger.info("OTP verified successfully for email: {}", email);
            otpStorage.remove(email);
            otpTimestamps.remove(email);
            return true;
        } else {
            logger.warn("Invalid OTP submitted for email: {}", email);
            return false;
        }
    }

    // --- Auth Service Logic ---
    @Transactional
    public User registerUserInternal(SignupRequestDto signupRequest) throws Exception {
        logger.info("Registering user: {}", signupRequest.getEmail());
        
        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            logger.warn("Email already registered: {}", signupRequest.getEmail());
            throw new Exception("Email address is already registered.");
        }
        
        User newUser = new User();
        newUser.setFullName(signupRequest.getFullName());
        newUser.setEmail(signupRequest.getEmail());
        newUser.setMobile(signupRequest.getMobile());
        newUser.setGender(signupRequest.getGender());
        newUser.setRole(signupRequest.getRole());
        newUser.setEducation(signupRequest.getEducation());
        newUser.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        
        User savedUser = userRepository.save(newUser);
        logger.info("User registered successfully with ID: {}", savedUser.getId());
        return savedUser;
    }

    public User loginUserInternal(LoginRequestDto loginRequest) throws Exception {
        logger.info("Attempting login for email: {}", loginRequest.getEmail());

        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        if (userOptional.isEmpty()) {
            logger.warn("Login failed: User not found for email {}", loginRequest.getEmail());
            throw new Exception("Invalid email or password.");
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            logger.warn("Login failed: Invalid password for email {}", loginRequest.getEmail());
            throw new Exception("Invalid email or password.");
        }

        logger.info("Login successful for email: {}", loginRequest.getEmail());
        return user;
    }

    // --- API Endpoints ---
    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtpEndpoint(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        
        if (email == null || email.trim().isEmpty() || !isValidEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Valid email is required."));
        }
        
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "This email is already registered. Please login."));
        }
        
        boolean sent = generateAndSendOtp(email);
        if (sent) {
            return ResponseEntity.ok(Map.of("message", "OTP has been sent to your email. Please verify."));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to send OTP email."));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtpEndpoint(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");
        
        if (email == null || otp == null || !isValidEmail(email) || !otp.matches("\\d{6}")) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Valid email and 6-digit OTP are required."));
        }
        
        boolean isValid = verifyOtp(email, otp);
        if (isValid) {
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully. Please complete registration."));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid or expired OTP."));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUserEndpoint(@RequestBody SignupRequestDto signupRequest) {
        if (signupRequest == null || 
            signupRequest.getEmail() == null || !isValidEmail(signupRequest.getEmail()) || 
            signupRequest.getPassword() == null || signupRequest.getPassword().isEmpty() || 
            signupRequest.getFullName() == null || signupRequest.getFullName().isEmpty()) {
            
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Required user data is missing or invalid."));
        }
        
        try {
            User registeredUser = registerUserInternal(signupRequest);
            logger.info("Registration success for: {}", registeredUser.getEmail());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully!");
            response.put("userId", registeredUser.getId());
            response.put("email", registeredUser.getEmail());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Registration failed for {}: {}", signupRequest.getEmail(), e.getMessage());
            
            if (e.getMessage() != null && e.getMessage().contains("Email address is already registered")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
            }
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Registration failed."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUserEndpoint(@RequestBody LoginRequestDto loginRequest) {
        if (loginRequest == null || 
            loginRequest.getEmail() == null || !isValidEmail(loginRequest.getEmail()) ||
            loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
            
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Valid email and password are required."));
        }

        try {
            User loggedInUser = loginUserInternal(loginRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful!");
            response.put("userId", loggedInUser.getId());
            response.put("email", loggedInUser.getEmail());
            response.put("fullName", loggedInUser.getFullName());
            response.put("mobile", loggedInUser.getMobile());
            response.put("gender", loggedInUser.getGender());
            response.put("role", loggedInUser.getRole());
            response.put("education", loggedInUser.getEducation());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login endpoint failed for email {}: {}", loginRequest.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", e.getMessage()));
        }
    }

    // --- Helper Methods ---
    private boolean isValidEmail(String email) {
        String emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        return email != null && email.matches(emailRegex);
    }
}
