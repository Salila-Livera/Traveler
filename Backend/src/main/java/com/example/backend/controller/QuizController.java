package com.example.backend.controller;

import com.example.backend.dto.QuizDto;
import com.example.backend.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService service;

    public QuizController(QuizService service) {
        this.service = service;
    }

    @GetMapping
    public List<QuizDto> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public QuizDto get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public QuizDto create(@RequestBody QuizDto in) {
        return service.create(in);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
        @PathVariable Long id,
        @RequestBody QuizDto in
    ) {
        QuizDto existing = service.get(id);

        if (!existing.getCreatorId().equals(in.getCreatorId())) {
            return ResponseEntity.status(403).body("You are not authorized to edit this quiz.");
        }

        QuizDto updated = service.update(id, in);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
        @PathVariable Long id,
        @RequestParam("creatorId") Long creatorId
    ) {
        QuizDto quiz = service.get(id);

        if (!quiz.getCreatorId().equals(creatorId)) {
            return ResponseEntity.status(403).body("You are not authorized to delete this quiz.");
        }

        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
