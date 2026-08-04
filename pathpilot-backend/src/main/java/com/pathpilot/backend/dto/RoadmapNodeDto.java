package com.pathpilot.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapNodeDto {
    private UUID id;
    private String title;
    private int weekNumber;
    private String description;
    private List<RoadmapTaskDto> tasks;
}
