package com.felc.controller;

import com.felc.dto.response.InscriptionResponse;
import com.felc.service.InscriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class InscriptionController {

    private final InscriptionService inscriptionService;

    public InscriptionController(InscriptionService inscriptionService) {
        this.inscriptionService = inscriptionService;
    }

    @PostMapping("/formations/{id}/inscription")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<InscriptionResponse> inscrire(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inscriptionService.inscrire(auth.getName(), id));
    }

    @GetMapping("/inscriptions/me")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<List<InscriptionResponse>> mesInscriptions(Authentication auth) {
        return ResponseEntity.ok(inscriptionService.mesInscriptions(auth.getName()));
    }
}
