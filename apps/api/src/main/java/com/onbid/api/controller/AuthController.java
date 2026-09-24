package com.onbid.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        response.put("message", "ONBID Spring Boot API is running");
        return ResponseEntity.ok(response);
    }

    // Mock Auth endpoint so frontend doesn't crash
    @GetMapping("/auth/me")
    public ResponseEntity<Map<String, String>> getCurrentUser() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Not authenticated");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}
