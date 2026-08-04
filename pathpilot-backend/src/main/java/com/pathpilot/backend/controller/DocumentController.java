package com.pathpilot.backend.controller;

import com.pathpilot.backend.dto.CompareJdRequest;
import com.pathpilot.backend.dto.DocumentDto;
import com.pathpilot.backend.dto.RagQueryRequest;
import com.pathpilot.backend.service.DocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentDto> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("fileType") String fileType) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        DocumentDto dto = documentService.uploadDocument(email, file, fileType);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DocumentDto>> getDocuments() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<DocumentDto> documents = documentService.getDocuments(email);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable("id") UUID id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        byte[] data = documentService.downloadDocument(id, email);
        ByteArrayResource resource = new ByteArrayResource(data);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"document_" + id + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable("id") UUID id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        documentService.deleteDocument(id, email);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/analyze")
    public ResponseEntity<Map<String, Object>> analyzeResume(@PathVariable("id") UUID id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Map<String, Object> analysis = documentService.analyzeResume(id, email);
        return ResponseEntity.ok(analysis);
    }

    @PostMapping("/{id}/compare-jd")
    public ResponseEntity<Map<String, Object>> compareResumeWithJd(
            @PathVariable("id") UUID id,
            @Valid @RequestBody CompareJdRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Map<String, Object> comparison = documentService.compareResumeWithJd(id, request.getJdText(), email);
        return ResponseEntity.ok(comparison);
    }

    @PostMapping("/rag-query")
    public ResponseEntity<Map<String, Object>> queryRag(@Valid @RequestBody RagQueryRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Map<String, Object> result = documentService.queryRag(request.getQuery(), email);
        return ResponseEntity.ok(result);
    }
}
