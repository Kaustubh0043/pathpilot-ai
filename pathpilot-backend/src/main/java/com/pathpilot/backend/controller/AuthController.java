package com.pathpilot.backend.controller;

import com.pathpilot.backend.dto.AuthResponse;
import com.pathpilot.backend.dto.LoginRequest;
import com.pathpilot.backend.dto.RefreshTokenRequest;
import com.pathpilot.backend.dto.SignupRequest;
import com.pathpilot.backend.dto.VerifyRequest;
import com.pathpilot.backend.dto.ResendCodeRequest;
import com.pathpilot.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<AuthResponse> verify(@Valid @RequestBody VerifyRequest request) {
        AuthResponse response = authService.verifyEmail(request.getEmail(), request.getCode());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resend-code")
    public ResponseEntity<Void> resendCode(@Valid @RequestBody ResendCodeRequest request) {
        authService.resendVerificationCode(request.getEmail());
        return ResponseEntity.ok().build();
    }
}
