package com.project.taskmanager.controller;

import com.project.taskmanager.model.User;
import com.project.taskmanager.repository.UserRepository;
import com.project.taskmanager.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepo, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {

        User dbUser = userRepo.findByEmail(user.getEmail());

        if (dbUser != null && dbUser.getPassword().equals(user.getPassword())) {
            return jwtUtil.generateToken(user.getEmail());
        }

        return "Invalid credentials";
    }
}