package com.project.taskmanager.controller;

import com.project.taskmanager.model.Project;
import com.project.taskmanager.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @PostMapping
    public Project create(@RequestBody Project project) {
        return service.save(project);
    }

    @GetMapping
    public List<Project> getAll() {
        return service.getAll();
    }
}