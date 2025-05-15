package com.example.backend.controller;
import com.example.backend.dto.JwtResponse;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.LoginDto;
import com.example.backend.dto.RegisterDto;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtTokenProvider;
import com.example.backend.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtTokenProvider jwtProvider;

    @Autowired
    public AuthController(AuthenticationManager authManager,
                          UserRepository userRepo,
                          PasswordEncoder encoder,
                          JwtTokenProvider jwtProvider) {
        this.authManager = authManager;
        this.userRepo     = userRepo;
        this.encoder      = encoder;
        this.jwtProvider  = jwtProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterDto dto) {
        if (userRepo.existsByEmail(dto.email())) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, "Email already in use"));
        }

        User user = new User(
            dto.name(),
            dto.email(),
            encoder.encode(dto.password())    // hash password once
        );
        userRepo.save(user);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(new ApiResponse(true, "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginDto dto) {
        try {
            Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
            );

            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            String token = jwtProvider.generateToken(principal.getId());

            return ResponseEntity.ok(new JwtResponse(token, principal.getId()));
        } catch (AuthenticationException ex) {
            // wrong credentials
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new JwtResponse(null, null));
        }
    }
}
