package com.pathpilot.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "roadmap_nodes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapNode {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "roadmap_id", nullable = false)
    private Roadmap roadmap;

    @Column(nullable = false)
    private String title;

    @Column(name = "week_number", nullable = false)
    private int weekNumber;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "node", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RoadmapTask> tasks = new ArrayList<>();
}
