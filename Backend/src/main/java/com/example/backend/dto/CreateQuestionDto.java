// src/main/java/com/example/backend/dto/CreateQuestionDto.java
package com.example.backend.dto;

import java.util.List;

public record CreateQuestionDto(
  String text,
  List<String> choices,
  int correctIndex
) { }
