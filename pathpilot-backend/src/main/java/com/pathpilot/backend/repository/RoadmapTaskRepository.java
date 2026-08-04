package com.pathpilot.backend.repository;

import com.pathpilot.backend.model.RoadmapTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RoadmapTaskRepository extends JpaRepository<RoadmapTask, UUID> {
}
