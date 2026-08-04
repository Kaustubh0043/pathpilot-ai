package com.pathpilot.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapDetailResponse {
    private UUID id;
    private String title;
    private String description;
    private List<RoadmapNodeDto> nodes;
    private LocalDateTime createdAt;
}
