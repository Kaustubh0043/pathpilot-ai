package com.pathpilot.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenerateRoadmapRequest {

    @NotBlank(message = "Target topic/role is required")
    private String topic;
}
