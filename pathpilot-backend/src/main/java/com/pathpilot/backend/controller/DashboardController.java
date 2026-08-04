package com.pathpilot.backend.controller;

import com.pathpilot.backend.dto.DashboardStatsResponse;
import com.pathpilot.backend.dto.SkillUpdateDto;
import com.pathpilot.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserService userService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        DashboardStatsResponse stats = userService.getDashboardStats(email);
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/skills")
    public ResponseEntity<Void> addOrUpdateSkill(@Valid @RequestBody SkillUpdateDto request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.addOrUpdateSkill(email, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/streak")
    public ResponseEntity<Void> updateStreak() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.incrementStreak(email);
        return ResponseEntity.ok().build();
    }
}
