package com.pathpilot.backend.controller;

import com.pathpilot.backend.dto.GenerateRoadmapRequest;
import com.pathpilot.backend.dto.RoadmapDetailResponse;
import com.pathpilot.backend.service.RoadmapService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/roadmaps")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;

    @PostMapping("/generate")
    public ResponseEntity<RoadmapDetailResponse> generateRoadmap(@Valid @RequestBody GenerateRoadmapRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        RoadmapDetailResponse response = roadmapService.generateRoadmap(email, request.getTopic());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RoadmapDetailResponse>> getRoadmaps() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<RoadmapDetailResponse> response = roadmapService.getRoadmaps(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoadmapDetailResponse> getRoadmap(@PathVariable("id") UUID id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        RoadmapDetailResponse response = roadmapService.getRoadmap(id, email);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/tasks/{taskId}/toggle")
    public ResponseEntity<Void> toggleTask(@PathVariable("taskId") UUID taskId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        roadmapService.toggleTask(taskId, email);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoadmap(@PathVariable("id") UUID id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        roadmapService.deleteRoadmap(id, email);
        return ResponseEntity.noContent().build();
    }
}
