package com.pathpilot.backend.service;

import com.pathpilot.backend.dto.DashboardStatsResponse;
import com.pathpilot.backend.dto.SkillUpdateDto;

public interface UserService {
    DashboardStatsResponse getDashboardStats(String email);
    void addOrUpdateSkill(String email, SkillUpdateDto skillUpdateDto);
    void incrementStreak(String email);
}
