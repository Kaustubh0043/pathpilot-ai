package com.pathpilot.backend.service;

import com.pathpilot.backend.dto.DocumentDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface DocumentService {
    DocumentDto uploadDocument(String email, MultipartFile file, String fileType);
    List<DocumentDto> getDocuments(String email);
    byte[] downloadDocument(UUID documentId, String email);
    void deleteDocument(UUID documentId, String email);
    Map<String, Object> analyzeResume(UUID documentId, String email);
    Map<String, Object> compareResumeWithJd(UUID resumeId, String jdText, String email);
    Map<String, Object> queryRag(String query, String email);
}
