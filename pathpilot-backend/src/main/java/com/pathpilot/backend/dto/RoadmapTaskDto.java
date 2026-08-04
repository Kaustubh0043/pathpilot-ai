package com.pathpilot.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapTaskDto {
    private UUID id;
    private String title;
    private boolean isCompleted;
    private int estimatedHours;
}
