// src/main/java/com/example/backend/dto/QuestionDto.java
package com.example.backend.dto;

import lombok.*;

import java.util.*;

@Data @AllArgsConstructor @NoArgsConstructor
public class QuestionDto {
    private Long id;
    private String text;
    private List<String> choices;
    private int correctIndex;
}