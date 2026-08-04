package com.pathpilot.backend.service;

import com.pathpilot.backend.dto.AuthResponse;
import com.pathpilot.backend.dto.LoginRequest;
import com.pathpilot.backend.dto.SignupRequest;

public interface AuthService {
    AuthResponse signup(SignupRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String refreshToken);
    AuthResponse verifyEmail(String email, String code);
    void resendVerificationCode(String email);
}
