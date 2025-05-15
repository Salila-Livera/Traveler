// src/main/java/com/example/backend/repository/QuizRepository.java
package com.example.backend.repository;

import com.example.backend.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> { }
