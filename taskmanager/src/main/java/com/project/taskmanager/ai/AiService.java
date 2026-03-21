package com.project.taskmanager.ai;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiService {

    private final String API_KEY = "AIzaSyBa9f1Z9-SaQfj442aV2gKIVKMVh_VK_bI";

    public String generateTask(String input) {

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY;

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> part = Map.of("text",
                "Generate short task description, steps and priority for: " + input);

        Map<String, Object> content = Map.of("parts", new Object[]{part});

        Map<String, Object> body = Map.of(
                "contents", new Object[]{content}
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        Map response = restTemplate.postForObject(url, entity, Map.class);

        // Extract response text
        List candidates = (List) response.get("candidates");
        Map candidate = (Map) candidates.get(0);
        Map contentMap = (Map) candidate.get("content");
        List parts = (List) contentMap.get("parts");

        return ((Map) parts.get(0)).get("text").toString();
    }
}