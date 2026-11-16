package com.felc.controller;

import com.felc.dto.request.MessageForumRequest;
import com.felc.dto.request.SujetRequest;
import com.felc.dto.response.MessageForumResponse;
import com.felc.dto.response.SujetDetailResponse;
import com.felc.dto.response.SujetResponse;
import com.felc.service.ForumService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forum")
public class ForumController {

    private final ForumService forumService;

    public ForumController(ForumService forumService) {
        this.forumService = forumService;
    }

    @GetMapping("/sujets")
    public ResponseEntity<List<SujetResponse>> listerSujets(
            @RequestParam(required = false) Long domaineId,
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(forumService.listerSujets(domaineId, q));
    }

    @GetMapping("/sujets/{id}")
    public ResponseEntity<SujetDetailResponse> detailSujet(@PathVariable Long id) {
        return ResponseEntity.ok(forumService.detailSujet(id));
    }

    @PostMapping("/sujets")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SujetResponse> creerSujet(Authentication auth,
                                                    @Valid @RequestBody SujetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(forumService.creerSujet(auth.getName(), request));
    }

    @PostMapping("/sujets/{id}/messages")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageForumResponse> repondre(Authentication auth,
                                                         @PathVariable Long id,
                                                         @Valid @RequestBody MessageForumRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(forumService.repondre(auth.getName(), id, request));
    }

    @PutMapping("/sujets/{id}/messages/{messageId}/solution")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageForumResponse> marquerSolution(Authentication auth,
                                                                @PathVariable Long id,
                                                                @PathVariable Long messageId) {
        return ResponseEntity.ok(forumService.marquerSolution(auth.getName(), id, messageId));
    }

    @DeleteMapping("/sujets/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> supprimerSujet(Authentication auth, @PathVariable Long id) {
        forumService.supprimerSujet(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/messages/{messageId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> supprimerMessage(Authentication auth, @PathVariable Long messageId) {
        forumService.supprimerMessage(auth.getName(), messageId);
        return ResponseEntity.noContent().build();
    }
}
