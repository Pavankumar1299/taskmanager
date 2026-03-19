package com.project.taskmanager.service;

import com.project.taskmanager.model.Task;
import com.project.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository repo;

    public TaskService(TaskRepository repo) {
        this.repo = repo;
    }

    public Task save(Task task) {
        return repo.save(task);
    }

    public List<Task> getAll() {
        return repo.findAll();
    }
}