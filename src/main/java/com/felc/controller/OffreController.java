package com.felc.controller;

import com.felc.dto.request.OffreRequest;
import com.felc.dto.request.StatutOffreRequest;
import com.felc.dto.response.OffreResponse;
import com.felc.enums.TypeOffre;
import com.felc.service.OffreService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/offres")
public class OffreController {

    private final OffreService offreService;

    public OffreController(OffreService offreService) {
        this.offreService = offreService;
    }

    @GetMapping
    public ResponseEntity<List<OffreResponse>> lister(@RequestParam(required = false) TypeOffre type,
                                                      @RequestParam(required = false) Long domaineId,
                                                      @RequestParam(required = false) Boolean remote,
                                                      @RequestParam(required = false) String q) {
        return ResponseEntity.ok(offreService.lister(type, domaineId, remote, q));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ENTREPRISE')")
    public ResponseEntity<List<OffreResponse>> mesOffres(Authentication auth) {
        return ResponseEntity.ok(offreService.mesOffres(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OffreResponse> detail(@PathVariable Long id) {
        return ResponseEntity.ok(offreService.detail(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ENTREPRISE')")
    public ResponseEntity<OffreResponse> creer(Authentication auth, @Valid @RequestBody OffreRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(offreService.creer(auth.getName(), request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ENTREPRISE','ADMIN')")
    public ResponseEntity<OffreResponse> modifier(Authentication auth, @PathVariable Long id,
                                                  @Valid @RequestBody OffreRequest request) {
        return ResponseEntity.ok(offreService.modifier(auth.getName(), id, request));
    }

    @PutMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('ENTREPRISE','ADMIN')")
    public ResponseEntity<OffreResponse> changerStatut(Authentication auth, @PathVariable Long id,
                                                       @Valid @RequestBody StatutOffreRequest request) {
        return ResponseEntity.ok(offreService.changerStatut(auth.getName(), id, request));
    }
}
