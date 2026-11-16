package com.felc.controller;

import com.felc.dto.request.AddCompetenceRequest;
import com.felc.dto.request.UpdateProfileRequest;
import com.felc.dto.response.UserResponse;
import com.felc.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getProfile(authentication.getName()));
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateProfile(Authentication authentication,
                                                      @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(authentication.getName(), request));
    }

    @PostMapping("/competences")
    public ResponseEntity<UserResponse> addCompetence(Authentication authentication,
                                                      @Valid @RequestBody AddCompetenceRequest request) {
        UserResponse response = userService.addCompetence(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/competences/{id}")
    public ResponseEntity<Void> removeCompetence(Authentication authentication, @PathVariable Long id) {
        userService.removeCompetence(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
