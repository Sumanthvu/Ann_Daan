public class AuthControllerTests {
    
}
package com.anndaan.controller;

import com.anndaan.dto.AuthenticationRequest;
import com.anndaan.dto.AuthenticationResponse;
import com.anndaan.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
public class AuthControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    public void testLoginSuccess() throws Exception {
        // Setup mock service
        AuthenticationRequest request = new AuthenticationRequest("test@example.com", "password");
        AuthenticationResponse response = new AuthenticationResponse(
                "jwt-token", 
                "test@example.com", 
                "ROLE_RESTAURANT", 
                1L);
        
        when(authService.authenticate(any(AuthenticationRequest.class))).thenReturn(response);

        // Execute the POST request
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.role").value("ROLE_RESTAURANT"))
                .andExpect(jsonPath("$.restaurantId").value(1));
    }

    @Test
    public void testLoginWithInvalidInput() throws Exception {
        // Invalid request with empty email and password
        AuthenticationRequest request = new AuthenticationRequest("", "");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}