package com.felc.controller;

import com.felc.dto.request.DomaineRequest;
import com.felc.dto.response.DomaineResponse;
import com.felc.service.DomaineService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/domaines")
public class DomaineController {

    private final DomaineService domaineService;

    public DomaineController(DomaineService domaineService) {
        this.domaineService = domaineService;
    }

    @GetMapping
    public ResponseEntity<List<DomaineResponse>> lister() {
        return ResponseEntity.ok(domaineService.lister());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DomaineResponse> creer(@Valid @RequestBody DomaineRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(domaineService.creer(request));
    }
}
