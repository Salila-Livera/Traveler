package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.*;

@Service
public class QuizService {

    private final QuizRepository quizRepo;
    private final UserRepository userRepo;

    public QuizService(QuizRepository quizRepo, UserRepository userRepo) {
        this.quizRepo = quizRepo;
        this.userRepo = userRepo;
    }

    public QuizDto create(QuizDto in) {
        // look up the User by creatorId
        User creator = userRepo.findById(in.getCreatorId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Quiz quiz = new Quiz();
        quiz.setTitle(in.getTitle());
        quiz.setDescription(in.getDescription());
        quiz.setCreator(creator);

        in.getQuestions().forEach(qd -> {
            Question q = new Question();
            q.setText(qd.getText());
            q.setChoices(qd.getChoices());
            q.setCorrectIndex(qd.getCorrectIndex());
            q.setQuiz(quiz);
            quiz.getQuestions().add(q);
        });

        return toDto(quizRepo.save(quiz));
    }

    public QuizDto update(Long quizId, QuizDto in) {
        Quiz quiz = quizRepo.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found"));

        quiz.setTitle(in.getTitle());
        quiz.setDescription(in.getDescription());

        // replace all questions
        quiz.getQuestions().clear();
        in.getQuestions().forEach(qd -> {
            Question q = new Question();
            q.setText(qd.getText());
            q.setChoices(qd.getChoices());
            q.setCorrectIndex(qd.getCorrectIndex());
            q.setQuiz(quiz);
            quiz.getQuestions().add(q);
        });

        return toDto(quizRepo.save(quiz));
    }

    public void delete(Long quizId) {
        Quiz quiz = quizRepo.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found"));
        quizRepo.delete(quiz);
    }

    public QuizDto get(Long quizId) {
        return toDto(quizRepo.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found")));
    }

    public List<QuizDto> list() {
        return quizRepo.findAll().stream()
                       .map(this::toDto)
                       .collect(Collectors.toList());
    }

    private QuizDto toDto(Quiz quiz) {
        List<QuestionDto> qDtos = quiz.getQuestions().stream()
            .map(q -> new QuestionDto(
                q.getId(),
                q.getText(),
                q.getChoices(),
                q.getCorrectIndex()
            ))
            .collect(Collectors.toList());

        return new QuizDto(
            quiz.getId(),
            quiz.getTitle(),
            quiz.getDescription(),
            qDtos,
            quiz.getCreator() != null ? quiz.getCreator().getId() : null 
        );
    }
}
