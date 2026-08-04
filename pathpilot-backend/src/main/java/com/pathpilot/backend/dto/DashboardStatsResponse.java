package com.pathpilot.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {
    private String fullName;
    private String email;
    private int streakCount;
    private List<SkillDto> skills;
    private int totalRoadmaps;
    private int totalDocuments;
    private Map<String, Integer> dailyActivity; // date (YYYY-MM-DD) -> activity level
}
