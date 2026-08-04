package com.pathpilot.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompareJdRequest {

    @NotBlank(message = "Job description text is required")
    private String jdText;
}
