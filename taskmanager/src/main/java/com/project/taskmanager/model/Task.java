package com.project.taskmanager.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    private String status;   // TODO, IN_PROGRESS, DONE
    private String priority; // LOW, MEDIUM, HIGH

    private LocalDate dueDate;

    // Many tasks → one project
    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonBackReference
    private Project project;

    // Many tasks → one user
    @ManyToOne
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;
}