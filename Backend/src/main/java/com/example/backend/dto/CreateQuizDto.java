// src/main/java/com/example/backend/dto/CreateQuizDto.java
package com.example.backend.dto;

import java.util.List;

public record CreateQuizDto(
  String title,
  String description,
  List<CreateQuestionDto> questions
) { }
