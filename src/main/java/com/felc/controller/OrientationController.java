package com.felc.controller;

import com.felc.dto.request.OrientationRequest;
import com.felc.dto.response.OrientationResponse;
import com.felc.service.OrientationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orientation")
public class OrientationController {

    private final OrientationService orientationService;

    public OrientationController(OrientationService orientationService) {
        this.orientationService = orientationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<OrientationResponse> orienter(Authentication auth,
                                                        @Valid @RequestBody OrientationRequest request) {
        return ResponseEntity.ok(orientationService.orienter(auth.getName(), request));
    }
}
