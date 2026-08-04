package com.pathpilot.backend.service;

import com.pathpilot.backend.dto.DashboardStatsResponse;
import com.pathpilot.backend.dto.SkillDto;
import com.pathpilot.backend.dto.SkillUpdateDto;
import com.pathpilot.backend.exception.ResourceNotFoundException;
import com.pathpilot.backend.model.User;
import com.pathpilot.backend.model.UserSkill;
import com.pathpilot.backend.repository.DocumentRepository;
import com.pathpilot.backend.repository.RoadmapRepository;
import com.pathpilot.backend.repository.UserRepository;
import com.pathpilot.backend.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final RoadmapRepository roadmapRepository;
    private final DocumentRepository documentRepository;

    @Override
    @Transactional
    public DashboardStatsResponse getDashboardStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        // Reset streak if last active date was before yesterday
        LocalDate today = LocalDate.now();
        if (user.getLastActiveDate() != null) {
            if (user.getLastActiveDate().isBefore(today.minusDays(1))) {
                user.setStreakCount(0);
                userRepository.save(user);
            }
        }

        List<UserSkill> skills = userSkillRepository.findByUserId(user.getId());
        List<SkillDto> skillDtos = skills.stream()
                .map(s -> SkillDto.builder()
                        .id(s.getId())
                        .skillName(s.getSkillName())
                        .progressPercentage(s.getProgressPercentage())
                        .build())
                .collect(Collectors.toList());

        int totalRoadmaps = roadmapRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).size();
        int totalDocuments = documentRepository.findByUserId(user.getId()).size();

        // Generate contribution calendar activity map for the last 30 days
        Map<String, Integer> dailyActivity = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Random random = new Random(user.getId().hashCode());

        for (int i = 0; i < 30; i++) {
            LocalDate date = today.minusDays(i);
            // Simulate random activity: 0 to 4 contributions
            int activity = random.nextInt(5);
            dailyActivity.put(date.format(formatter), activity);
        }

        return DashboardStatsResponse.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .streakCount(user.getStreakCount())
                .skills(skillDtos)
                .totalRoadmaps(totalRoadmaps)
                .totalDocuments(totalDocuments)
                .dailyActivity(dailyActivity)
                .build();
    }

    @Override
    @Transactional
    public void addOrUpdateSkill(String email, SkillUpdateDto skillUpdateDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        List<UserSkill> skills = userSkillRepository.findByUserId(user.getId());
        Optional<UserSkill> existingSkill = skills.stream()
                .filter(s -> s.getSkillName().equalsIgnoreCase(skillUpdateDto.getSkillName()))
                .findFirst();

        if (existingSkill.isPresent()) {
            UserSkill skill = existingSkill.get();
            skill.setProgressPercentage(skillUpdateDto.getProgressPercentage());
            userSkillRepository.save(skill);
        } else {
            UserSkill skill = UserSkill.builder()
                    .user(user)
                    .skillName(skillUpdateDto.getSkillName())
                    .progressPercentage(skillUpdateDto.getProgressPercentage())
                    .build();
            userSkillRepository.save(skill);
        }
    }

    @Override
    @Transactional
    public void incrementStreak(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        LocalDate today = LocalDate.now();
        if (user.getLastActiveDate() == null) {
            user.setStreakCount(1);
        } else if (user.getLastActiveDate().isBefore(today)) {
            if (user.getLastActiveDate().isEqual(today.minusDays(1))) {
                user.setStreakCount(user.getStreakCount() + 1);
            } else if (!user.getLastActiveDate().isEqual(today)) {
                user.setStreakCount(1); // Streak broken, restart
            }
        }
        user.setLastActiveDate(today);
        userRepository.save(user);
    }
}
