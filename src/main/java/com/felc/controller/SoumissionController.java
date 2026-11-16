package com.felc.controller;

import com.felc.dto.request.EvaluationRequest;
import com.felc.dto.request.SoumissionRequest;
import com.felc.dto.response.SoumissionResponse;
import com.felc.service.SoumissionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SoumissionController {

    private final SoumissionService soumissionService;

    public SoumissionController(SoumissionService soumissionService) {
        this.soumissionService = soumissionService;
    }

    @PostMapping("/exercices/{id}/soumissions")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<SoumissionResponse> soumettre(Authentication auth, @PathVariable Long id,
                                                        @Valid @RequestBody SoumissionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(soumissionService.soumettre(auth.getName(), id, request));
    }

    @GetMapping("/soumissions/me")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<List<SoumissionResponse>> mesSoumissions(Authentication auth) {
        return ResponseEntity.ok(soumissionService.mesSoumissions(auth.getName()));
    }

    @GetMapping("/soumissions/a-evaluer")
    @PreAuthorize("hasAnyRole('FORMATEUR','ADMIN')")
    public ResponseEntity<List<SoumissionResponse>> aEvaluer(Authentication auth) {
        return ResponseEntity.ok(soumissionService.aEvaluer(auth.getName()));
    }

    @PutMapping("/soumissions/{id}/evaluation")
    @PreAuthorize("hasAnyRole('FORMATEUR','ADMIN')")
    public ResponseEntity<SoumissionResponse> evaluer(Authentication auth, @PathVariable Long id,
                                                      @Valid @RequestBody EvaluationRequest request) {
        return ResponseEntity.ok(soumissionService.evaluer(auth.getName(), id, request));
    }

    @PostMapping("/soumissions/{id}/correction-ia")
    @PreAuthorize("hasAnyRole('APPRENANT','FORMATEUR','ADMIN')")
    public ResponseEntity<SoumissionResponse> corrigerParIA(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(soumissionService.evaluerParIA(auth.getName(), id));
    }
}
