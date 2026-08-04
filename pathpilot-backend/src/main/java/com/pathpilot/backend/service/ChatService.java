package com.pathpilot.backend.service;

import com.pathpilot.backend.dto.ConversationDto;
import com.pathpilot.backend.dto.MessageDto;

import java.util.List;
import java.util.UUID;

public interface ChatService {
    List<ConversationDto> getConversations(String email);
    ConversationDto createConversation(String email, String title);
    List<MessageDto> getMessages(UUID conversationId, String email);
    MessageDto sendMessage(UUID conversationId, String email, String content);
    void deleteConversation(UUID conversationId, String email);
}
