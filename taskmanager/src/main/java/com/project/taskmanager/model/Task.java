package com.project.taskmanager.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    private String id;

    private String title;

    private String description;

    private Priority priority;

    private Status status;

    private LocalDate dueDate;

    private LocalDateTime createdAt;

    private String userId;

    public Task(String title, String description, Priority priority, Status status, LocalDate dueDate, String userId) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.dueDate = dueDate;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
    }
}
