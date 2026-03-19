package com.project.taskmanager.service;

import com.project.taskmanager.model.Project;
import com.project.taskmanager.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository repo;

    public ProjectService(ProjectRepository repo) {
        this.repo = repo;
    }

    public Project save(Project project) {
        return repo.save(project);
    }

    public List<Project> getAll() {
        return repo.findAll();
    }
}