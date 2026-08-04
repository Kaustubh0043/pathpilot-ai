package com.pathpilot.backend.repository;

import com.pathpilot.backend.model.RoadmapNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RoadmapNodeRepository extends JpaRepository<RoadmapNode, UUID> {
}
