package com.pathpilot.backend.controller;

import com.pathpilot.backend.dto.ConversationDto;
import com.pathpilot.backend.dto.CreateConversationRequest;
import com.pathpilot.backend.dto.MessageDto;
import com.pathpilot.backend.dto.SendMessageRequest;
import com.pathpilot.backend.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> getConversations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<ConversationDto> conversations = chatService.getConversations(email);
        return ResponseEntity.ok(conversations);
    }

    @PostMapping("/conversations")
    public ResponseEntity<ConversationDto> createConversation(@Valid @RequestBody CreateConversationRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        ConversationDto conversation = chatService.createConversation(email, request.getTitle());
        return new ResponseEntity<>(conversation, HttpStatus.CREATED);
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(@PathVariable("id") UUID conversationId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<MessageDto> messages = chatService.getMessages(conversationId, email);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/conversations/{id}/messages")
    public ResponseEntity<MessageDto> sendMessage(
            @PathVariable("id") UUID conversationId,
            @Valid @RequestBody SendMessageRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        MessageDto message = chatService.sendMessage(conversationId, email, request.getContent());
        return ResponseEntity.ok(message);
    }

    @DeleteMapping("/conversations/{id}")
    public ResponseEntity<Void> deleteConversation(@PathVariable("id") UUID conversationId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        chatService.deleteConversation(conversationId, email);
        return ResponseEntity.noContent().build();
    }
}
