package com.felc.controller;

import com.felc.dto.request.CandidatureRequest;
import com.felc.dto.request.StatutCandidatureRequest;
import com.felc.dto.response.CandidatureResponse;
import com.felc.service.CandidatureService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CandidatureController {

    private final CandidatureService candidatureService;

    public CandidatureController(CandidatureService candidatureService) {
        this.candidatureService = candidatureService;
    }

    @PostMapping("/offres/{id}/candidatures")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<CandidatureResponse> postuler(Authentication auth, @PathVariable Long id,
                                                        @Valid @RequestBody CandidatureRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(candidatureService.postuler(auth.getName(), id, request));
    }

    @GetMapping("/candidatures/me")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<List<CandidatureResponse>> mesCandidatures(Authentication auth) {
        return ResponseEntity.ok(candidatureService.mesCandidatures(auth.getName()));
    }

    @GetMapping("/offres/{id}/candidatures")
    @PreAuthorize("hasAnyRole('ENTREPRISE','ADMIN')")
    public ResponseEntity<List<CandidatureResponse>> candidaturesDeLOffre(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(candidatureService.candidaturesDeLOffre(auth.getName(), id));
    }

    @PutMapping("/candidatures/{id}/statut")
    @PreAuthorize("hasAnyRole('ENTREPRISE','ADMIN')")
    public ResponseEntity<CandidatureResponse> changerStatut(Authentication auth, @PathVariable Long id,
                                                             @Valid @RequestBody StatutCandidatureRequest request) {
        return ResponseEntity.ok(candidatureService.changerStatut(auth.getName(), id, request));
    }
}
