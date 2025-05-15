// src/main/java/com/example/backend/model/Quiz.java
package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity @Data @NoArgsConstructor @AllArgsConstructor
@Table(name="quizzes")
public class Quiz {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;
  private String description;

  @ManyToOne(optional=false)
  @JoinColumn(name="creator_id")
  private User creator;

  @OneToMany(mappedBy="quiz", cascade=CascadeType.ALL, orphanRemoval=true)
  private List<Question> questions = new ArrayList<>();
}
