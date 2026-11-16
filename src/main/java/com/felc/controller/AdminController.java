package com.felc.controller;

import com.felc.dto.request.ActivationRequest;
import com.felc.dto.response.AdminStatsResponse;
import com.felc.dto.response.AdminUserResponse;
import com.felc.dto.response.OffreResponse;
import com.felc.enums.Role;
import com.felc.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> stats() {
        return ResponseEntity.ok(adminService.stats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> utilisateurs(@RequestParam(required = false) Role role) {
        return ResponseEntity.ok(adminService.utilisateurs(role));
    }

    @PutMapping("/users/{id}/activation")
    public ResponseEntity<AdminUserResponse> changerActivation(Authentication auth, @PathVariable Long id,
                                                               @RequestBody ActivationRequest request) {
        return ResponseEntity.ok(adminService.changerActivation(auth.getName(), id, request));
    }

    @GetMapping("/offres")
    public ResponseEntity<List<OffreResponse>> offres() {
        return ResponseEntity.ok(adminService.offres());
    }
}
