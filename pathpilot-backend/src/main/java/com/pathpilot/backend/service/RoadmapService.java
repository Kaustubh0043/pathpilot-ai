package com.pathpilot.backend.service;

import com.pathpilot.backend.dto.RoadmapDetailResponse;

import java.util.List;
import java.util.UUID;

public interface RoadmapService {
    RoadmapDetailResponse generateRoadmap(String email, String topic);
    List<RoadmapDetailResponse> getRoadmaps(String email);
    RoadmapDetailResponse getRoadmap(UUID id, String email);
    void toggleTask(UUID taskId, String email);
    void deleteRoadmap(UUID id, String email);
}
