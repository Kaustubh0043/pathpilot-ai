package com.pathpilot.backend.service;

import com.pathpilot.backend.dto.RoadmapDetailResponse;
import com.pathpilot.backend.dto.RoadmapNodeDto;
import com.pathpilot.backend.dto.RoadmapTaskDto;
import com.pathpilot.backend.exception.ResourceNotFoundException;
import com.pathpilot.backend.model.Roadmap;
import com.pathpilot.backend.model.RoadmapNode;
import com.pathpilot.backend.model.RoadmapTask;
import com.pathpilot.backend.model.User;
import com.pathpilot.backend.repository.RoadmapNodeRepository;
import com.pathpilot.backend.repository.RoadmapRepository;
import com.pathpilot.backend.repository.RoadmapTaskRepository;
import com.pathpilot.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class RoadmapServiceImpl implements RoadmapService {

    private final UserRepository userRepository;
    private final RoadmapRepository roadmapRepository;
    private final RoadmapTaskRepository roadmapTaskRepository;
    private final RestClient restClient;

    public RoadmapServiceImpl(
            UserRepository userRepository,
            RoadmapRepository roadmapRepository,
            RoadmapTaskRepository roadmapTaskRepository,
            @Value("${ai.service.url}") String aiServiceUrl) {
        this.userRepository = userRepository;
        this.roadmapRepository = roadmapRepository;
        this.roadmapTaskRepository = roadmapTaskRepository;
        this.restClient = RestClient.builder().baseUrl(aiServiceUrl).build();
    }

    @Override
    @Transactional
    public RoadmapDetailResponse generateRoadmap(String email, String topic) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        // 1. Contact Python AI service
        Map<String, Object> aiResponse;
        try {
            Map<String, String> requestPayload = Map.of("topic", topic);
            aiResponse = restClient.post()
                    .uri("/api/ai/roadmap")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestPayload)
                    .retrieve()
                    .body(Map.class);
        } catch (Exception e) {
            log.error("Failed to query Python AI service for roadmap", e);
            // Fallback mock roadmap so application remains functional if AI service is offline
            aiResponse = createMockRoadmapPayload(topic);
        }

        if (aiResponse == null) {
            aiResponse = createMockRoadmapPayload(topic);
        }

        // 2. Save roadmap to Database
        String title = (String) aiResponse.getOrDefault("title", topic + " Roadmap");
        String description = (String) aiResponse.getOrDefault("description", "AI-Generated custom learning path for " + topic);

        Roadmap roadmap = Roadmap.builder()
                .user(user)
                .title(title)
                .description(description)
                .build();

        List<?> nodesRaw = (List<?>) aiResponse.get("nodes");
        List<RoadmapNode> nodes = new ArrayList<>();

        if (nodesRaw != null) {
            for (Object nodeRaw : nodesRaw) {
                Map<?, ?> nodeMap = (Map<?, ?>) nodeRaw;
                String nodeTitle = (String) nodeMap.get("title");
                Number weekNumber = (Number) nodeMap.get("weekNumber");
                String nodeDesc = (String) nodeMap.get("description");

                RoadmapNode node = RoadmapNode.builder()
                        .roadmap(roadmap)
                        .title(nodeTitle)
                        .weekNumber(weekNumber != null ? weekNumber.intValue() : 1)
                        .description(nodeDesc)
                        .build();

                List<?> tasksRaw = (List<?>) nodeMap.get("tasks");
                List<RoadmapTask> tasks = new ArrayList<>();
                if (tasksRaw != null) {
                    for (Object taskRaw : tasksRaw) {
                        Map<?, ?> taskMap = (Map<?, ?>) taskRaw;
                        String taskTitle = (String) taskMap.get("title");
                        Number hours = (Number) taskMap.get("estimatedHours");

                        RoadmapTask task = RoadmapTask.builder()
                                .node(node)
                                .title(taskTitle)
                                .isCompleted(false)
                                .estimatedHours(hours != null ? hours.intValue() : 2)
                                .build();
                        tasks.add(task);
                    }
                }
                node.setTasks(tasks);
                nodes.add(node);
            }
        }
        roadmap.setNodes(nodes);

        Roadmap saved = roadmapRepository.save(roadmap);
        return mapToDetailResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoadmapDetailResponse> getRoadmaps(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        return roadmapRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToDetailResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RoadmapDetailResponse getRoadmap(UUID id, String email) {
        Roadmap roadmap = roadmapRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap not found: " + id));

        if (!roadmap.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new AccessDeniedException("Access denied to this roadmap");
        }

        return mapToDetailResponse(roadmap);
    }

    @Override
    @Transactional
    public void toggleTask(UUID taskId, String email) {
        RoadmapTask task = roadmapTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));

        if (!task.getNode().getRoadmap().getUser().getEmail().equalsIgnoreCase(email)) {
            throw new AccessDeniedException("Access denied to update task status");
        }

        task.setCompleted(!task.isCompleted());
        roadmapTaskRepository.save(task);
    }

    @Override
    @Transactional
    public void deleteRoadmap(UUID id, String email) {
        Roadmap roadmap = roadmapRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap not found: " + id));

        if (!roadmap.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new AccessDeniedException("Access denied to delete roadmap");
        }

        roadmapRepository.delete(roadmap);
    }

    private RoadmapDetailResponse mapToDetailResponse(Roadmap roadmap) {
        List<RoadmapNodeDto> nodeDtos = roadmap.getNodes().stream()
                .map(n -> {
                    List<RoadmapTaskDto> taskDtos = n.getTasks().stream()
                            .map(t -> RoadmapTaskDto.builder()
                                    .id(t.getId())
                                    .title(t.getTitle())
                                    .isCompleted(t.isCompleted())
                                    .estimatedHours(t.getEstimatedHours())
                                    .build())
                            .collect(Collectors.toList());

                    return RoadmapNodeDto.builder()
                            .id(n.getId())
                            .title(n.getTitle())
                            .weekNumber(n.getWeekNumber())
                            .description(n.getDescription())
                            .tasks(taskDtos)
                            .build();
                })
                .sorted(Comparator.comparingInt(RoadmapNodeDto::getWeekNumber))
                .collect(Collectors.toList());

        return RoadmapDetailResponse.builder()
                .id(roadmap.getId())
                .title(roadmap.getTitle())
                .description(roadmap.getDescription())
                .nodes(nodeDtos)
                .createdAt(roadmap.getCreatedAt())
                .build();
    }

    private Map<String, Object> createMockRoadmapPayload(String topic) {
        log.warn("Using offline mock roadmap payload generator for: {}", topic);
        Map<String, Object> payload = new HashMap<>();
        payload.put("title", topic + " Professional Roadmap");
        payload.put("description", "A modular 4-week learning path generated to master " + topic + " basics to intermediate levels.");

        List<Map<String, Object>> nodes = new ArrayList<>();

        for (int week = 1; week <= 4; week++) {
            Map<String, Object> node = new HashMap<>();
            node.put("title", "Week " + week + ": " + topic + " Core Concepts");
            node.put("weekNumber", week);
            node.put("description", "Deep dive into structural components, configuration settings, and standard practices for " + topic + ".");

            List<Map<String, Object>> tasks = new ArrayList<>();
            tasks.add(Map.of("title", "Study foundation docs and architecture guidelines", "estimatedHours", 3));
            tasks.add(Map.of("title", "Build a practice boilerplate using " + topic, "estimatedHours", 5));
            tasks.add(Map.of("title", "Complete module quiz and performance review", "estimatedHours", 2));

            node.put("tasks", tasks);
            nodes.add(node);
        }

        payload.put("nodes", nodes);
        return payload;
    }
}
