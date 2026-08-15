package com.pathpilot.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@Slf4j
public class AiProxyController {

    private final RestClient restClient;

    public AiProxyController(@Value("${ai.service.url}") String aiServiceUrl) {
        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(java.time.Duration.ofSeconds(10))
                .build();
        org.springframework.http.client.JdkClientHttpRequestFactory factory = new org.springframework.http.client.JdkClientHttpRequestFactory(httpClient);
        factory.setReadTimeout(25000);
        this.restClient = RestClient.builder()
                .baseUrl(aiServiceUrl)
                .requestFactory(factory)
                .build();
    }

    @PostMapping("/project")
    public ResponseEntity<Map<String, Object>> generateProject(@RequestBody Map<String, Object> request) {
        try {
            Map<?, ?> response = restClient.post()
                    .uri("/api/ai/project")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(Map.class);

            if (response != null) {
                return ResponseEntity.ok((Map<String, Object>) response);
            }
        } catch (Exception e) {
            log.error("Failed to proxy project generation call to FastAPI", e);
        }
        return ResponseEntity.ok(createMockProject(request.getOrDefault("stack", "Fullstack").toString()));
    }

    @PostMapping("/interview/generate")
    public ResponseEntity<Map<String, Object>> generateInterviewQuestions(@RequestBody Map<String, Object> request) {
        try {
            Map<?, ?> response = restClient.post()
                    .uri("/api/ai/interview/generate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(Map.class);

            if (response != null) {
                return ResponseEntity.ok((Map<String, Object>) response);
            }
        } catch (Exception e) {
            log.error("Failed to proxy interview generation to FastAPI", e);
        }
        return ResponseEntity.ok(createMockInterview(request.getOrDefault("role", "Software Engineer").toString()));
    }

    @PostMapping("/interview/evaluate")
    public ResponseEntity<Map<String, Object>> evaluateInterviewAnswer(@RequestBody Map<String, Object> request) {
        try {
            Map<?, ?> response = restClient.post()
                    .uri("/api/ai/interview/evaluate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(Map.class);

            if (response != null) {
                return ResponseEntity.ok((Map<String, Object>) response);
            }
        } catch (Exception e) {
            log.error("Failed to proxy interview evaluation to FastAPI", e);
        }
        return ResponseEntity.ok(createMockEvaluation(
                request.getOrDefault("question", "").toString(),
                request.getOrDefault("answer", "").toString()
        ));
    }

    private Map<String, Object> createMockProject(String stack) {
        log.warn("Using offline mock project blueprint generator for stack: {}", stack);
        Map<String, Object> mock = new HashMap<>();
        mock.put("ideas", "Build a high-performance analytics ingestion pipeline utilizing " + stack + ".");
        mock.put("folder_structure", "src/\n├── components/\n├── services/\n├── config/\n└── App.js");
        mock.put("api_suggestions", "GET /api/v1/analytics\nPOST /api/v1/ingest");
        mock.put("database_design", "Table User {\n  id uuid [pk]\n  name varchar\n}");
        return mock;
    }

    private Map<String, Object> createMockInterview(String role) {
        log.warn("Using offline mock interview generator for role: {}", role);
        Map<String, Object> mock = new HashMap<>();
        mock.put("question", "Offline Fallback: Unable to generate dynamic questions. Please configure your live Render AI_SERVICE_URL variable.");
        mock.put("expected_points", "Configure live Render settings to fetch AI questions.");
        return mock;
    }

    private Map<String, Object> createMockEvaluation(String question, String answer) {
        log.warn("Using offline mock interview evaluator for answer length: {}", answer.length());
        Map<String, Object> mock = new HashMap<>();
        mock.put("score", 0);
        mock.put("feedback", "Offline Fallback: The backend service is currently unable to communicate with the AI evaluation model. Please verify that the 'AI_SERVICE_URL' environment variable is correctly configured on your Render backend dashboard.");
        mock.put("model_answer", "Verify your Render environment configurations to enable live AI mock evaluations.");
        return mock;
    }
}
