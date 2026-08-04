package com.pathpilot.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDto {
    private UUID id;
    private String sender; // USER or AI
    private String content;
    private LocalDateTime createdAt;
}
