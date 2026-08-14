package com.pathpilot.backend.service;

import com.pathpilot.backend.dto.ConversationDto;
import com.pathpilot.backend.dto.MessageDto;
import com.pathpilot.backend.exception.ResourceNotFoundException;
import com.pathpilot.backend.model.Conversation;
import com.pathpilot.backend.model.Message;
import com.pathpilot.backend.model.User;
import com.pathpilot.backend.repository.ConversationRepository;
import com.pathpilot.backend.repository.MessageRepository;
import com.pathpilot.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final RestClient restClient;

    public ChatServiceImpl(
            UserRepository userRepository,
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            @Value("${ai.service.url}") String aiServiceUrl) {
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();
        this.restClient = RestClient.builder()
                .baseUrl(aiServiceUrl)
                .requestFactory(new JdkClientHttpRequestFactory(httpClient))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversationDto> getConversations(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        return conversationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(c -> ConversationDto.builder()
                        .id(c.getId())
                        .title(c.getTitle())
                        .createdAt(c.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ConversationDto createConversation(String email, String title) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        Conversation conversation = Conversation.builder()
                .user(user)
                .title(title)
                .build();

        Conversation saved = conversationRepository.save(conversation);

        return ConversationDto.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDto> getMessages(UUID conversationId, String email) {
        Conversation conversation = verifyAndGetConversation(conversationId, email);

        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversation.getId()).stream()
                .map(m -> MessageDto.builder()
                        .id(m.getId())
                        .sender(m.getSender())
                        .content(m.getContent())
                        .createdAt(m.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MessageDto sendMessage(UUID conversationId, String email, String content) {
        Conversation conversation = verifyAndGetConversation(conversationId, email);

        // 1. Save user message to database
        Message userMessage = Message.builder()
                .conversation(conversation)
                .sender("USER")
                .content(content)
                .build();
        messageRepository.save(userMessage);

        // 2. Fetch recent conversation history to provide context to LLM
        List<Message> historyMessages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        List<Map<String, String>> historyPayload = historyMessages.stream()
                .map(m -> {
                    Map<String, String> msgMap = new HashMap<>();
                    msgMap.put("role", m.getSender().equalsIgnoreCase("USER") ? "user" : "assistant");
                    msgMap.put("content", m.getContent());
                    return msgMap;
                })
                .collect(Collectors.toList());

        // 3. Make HTTP request to FastAPI Python AI Service
        String aiResponseText;
        try {
            User user = conversation.getUser();
            Map<String, Object> requestPayload = new HashMap<>();
            requestPayload.put("message", content);
            requestPayload.put("history", historyPayload);

            // Add user profile context for AI career coach personalization (Point 18)
            if (user != null) {
                Map<String, Object> profileMap = new HashMap<>();
                profileMap.put("careerGoal", user.getCareerGoal());
                profileMap.put("experienceLevel", user.getExperienceLevel());
                profileMap.put("careerObjective", user.getCareerObjective());
                profileMap.put("skillGaps", user.getSkillGaps());
                profileMap.put("technologies", user.getTechnologies());
                profileMap.put("weeklyCommitment", user.getWeeklyCommitment());
                profileMap.put("optionalLearningStyle", user.getOptionalLearningStyle());
                profileMap.put("optionalJobPreference", user.getOptionalJobPreference());
                requestPayload.put("profile", profileMap);
            }

            Map<?, ?> response = restClient.post()
                    .uri("/api/ai/chat")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestPayload)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("response")) {
                aiResponseText = (String) response.get("response");
            } else {
                aiResponseText = "Received empty response from AI engine.";
            }
        } catch (Exception e) {
            log.error("Failed to query Python AI service", e);
            aiResponseText = "Sorry, I am having trouble connecting to my brain module right now. Please verify the AI Service is running.";
        }

        // 4. Save AI message to database
        Message aiMessage = Message.builder()
                .conversation(conversation)
                .sender("AI")
                .content(aiResponseText)
                .build();
        Message savedAiMessage = messageRepository.save(aiMessage);

        return MessageDto.builder()
                .id(savedAiMessage.getId())
                .sender(savedAiMessage.getSender())
                .content(savedAiMessage.getContent())
                .createdAt(savedAiMessage.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public void deleteConversation(UUID conversationId, String email) {
        Conversation conversation = verifyAndGetConversation(conversationId, email);
        conversationRepository.delete(conversation);
    }

    private Conversation verifyAndGetConversation(UUID conversationId, String email) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found: " + conversationId));

        if (!conversation.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new AccessDeniedException("You do not have access to this conversation");
        }

        return conversation;
    }
}
