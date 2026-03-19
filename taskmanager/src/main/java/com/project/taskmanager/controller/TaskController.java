package com.project.taskmanager.controller;

import com.project.taskmanager.model.Task;
import com.project.taskmanager.service.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @PostMapping
    public Task create(@RequestBody Task task) {
        return service.save(task);
    }

    @GetMapping
    public List<Task> getAll() {
        return service.getAll();
    }
}