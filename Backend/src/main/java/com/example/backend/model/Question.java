// src/main/java/com/example/backend/model/Question.java
package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity @Data @NoArgsConstructor @AllArgsConstructor
@Table(name="questions")
public class Question {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional=false)
  @JoinColumn(name="quiz_id")
  private Quiz quiz;

  private String text;

  @ElementCollection
  @CollectionTable(name="question_choices", joinColumns=@JoinColumn(name="question_id"))
  @Column(name="choice")
  private List<String> choices = new ArrayList<>();

  private int correctIndex;
}
