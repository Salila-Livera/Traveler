// src/main/java/com/example/backend/dto/QuizDto.java
package com.example.backend.dto;

import lombok.*;

import java.util.*;

@Data @AllArgsConstructor @NoArgsConstructor
public class QuizDto {
    private Long id;
    private String title;
    private String description;
    private List<QuestionDto> questions;
    private Long creatorId;
}