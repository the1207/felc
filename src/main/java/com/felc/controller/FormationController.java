package com.felc.controller;

import com.felc.dto.request.ExerciceRequest;
import com.felc.dto.request.FormationRequest;
import com.felc.dto.request.ModuleRequest;
import com.felc.dto.response.ExerciceResponse;
import com.felc.dto.response.FormationDetailResponse;
import com.felc.dto.response.FormationResponse;
import com.felc.dto.response.ModuleResponse;
import com.felc.enums.Niveau;
import com.felc.service.FormationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class FormationController {

    private final FormationService formationService;

    public FormationController(FormationService formationService) {
        this.formationService = formationService;
    }

    @GetMapping("/formations")
    public ResponseEntity<List<FormationResponse>> lister(@RequestParam(required = false) Niveau niveau,
                                                          @RequestParam(required = false) Long domaineId) {
        return ResponseEntity.ok(formationService.lister(niveau, domaineId));
    }

    @GetMapping("/formations/{id}")
    public ResponseEntity<FormationDetailResponse> detail(@PathVariable Long id) {
        return ResponseEntity.ok(formationService.detail(id));
    }

    @PostMapping("/formations")
    @PreAuthorize("hasAnyRole('FORMATEUR','ADMIN')")
    public ResponseEntity<FormationResponse> creer(Authentication auth, @Valid @RequestBody FormationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(formationService.creer(auth.getName(), request));
    }

    @PutMapping("/formations/{id}")
    @PreAuthorize("hasAnyRole('FORMATEUR','ADMIN')")
    public ResponseEntity<FormationResponse> modifier(Authentication auth, @PathVariable Long id,
                                                      @Valid @RequestBody FormationRequest request) {
        return ResponseEntity.ok(formationService.modifier(auth.getName(), id, request));
    }

    @PostMapping("/formations/{id}/modules")
    @PreAuthorize("hasAnyRole('FORMATEUR','ADMIN')")
    public ResponseEntity<ModuleResponse> ajouterModule(Authentication auth, @PathVariable Long id,
                                                        @Valid @RequestBody ModuleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(formationService.ajouterModule(auth.getName(), id, request));
    }

    @PutMapping("/modules/{id}")
    @PreAuthorize("hasAnyRole('FORMATEUR','ADMIN')")
    public ResponseEntity<ModuleResponse> modifierModule(Authentication auth, @PathVariable Long id,
                                                         @Valid @RequestBody ModuleRequest request) {
        return ResponseEntity.ok(formationService.modifierModule(auth.getName(), id, request));
    }

    @DeleteMapping("/modules/{id}")
    @PreAuthorize("hasAnyRole('FORMATEUR','ADMIN')")
    public ResponseEntity<Void> supprimerModule(Authentication auth, @PathVariable Long id) {
        formationService.supprimerModule(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/formations/{id}/exercices")
    @PreAuthorize("hasAnyRole('FORMATEUR','ADMIN')")
    public ResponseEntity<ExerciceResponse> ajouterExercice(Authentication auth, @PathVariable Long id,
                                                            @Valid @RequestBody ExerciceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(formationService.ajouterExercice(auth.getName(), id, request));
    }

    @PutMapping("/exercices/{id}")
    @PreAuthorize("hasAnyRole('FORMATEUR','ADMIN')")
    public ResponseEntity<ExerciceResponse> modifierExercice(Authentication auth, @PathVariable Long id,
                                                             @Valid @RequestBody ExerciceRequest request) {
        return ResponseEntity.ok(formationService.modifierExercice(auth.getName(), id, request));
    }
}
