package com.artspark.controller;

import com.artspark.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:8081", "http://localhost:3000"})
public class StatsController {

    @Autowired
    private StatsService statsService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllStats() {
        Map<String, Object> stats = statsService.getAllStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/artworks")
    public ResponseEntity<Map<String, Object>> getArtworkStats() {
        Map<String, Object> stats = statsService.getArtworkStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/reviews")
    public ResponseEntity<Map<String, Object>> getReviewStats() {
        Map<String, Object> stats = statsService.getReviewStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/contact")
    public ResponseEntity<Map<String, Object>> getContactStats() {
        Map<String, Object> stats = statsService.getContactStats();
        return ResponseEntity.ok(stats);
    }
}
