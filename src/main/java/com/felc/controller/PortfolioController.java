package com.felc.controller;

import com.felc.dto.request.PortfolioVisibilite;
import com.felc.dto.response.PortfolioResponse;
import com.felc.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PortfolioResponse> publicPortfolio(@PathVariable Long id) {
        return ResponseEntity.ok(portfolioService.portfolioPublic(id));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<PortfolioResponse> monPortfolio(Authentication auth) {
        return ResponseEntity.ok(portfolioService.monPortfolio(auth.getName()));
    }

    @PutMapping("/me/visibilite")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<PortfolioVisibilite> definirVisibilite(Authentication auth,
                                                                 @RequestBody PortfolioVisibilite request) {
        return ResponseEntity.ok(portfolioService.definirVisibilite(auth.getName(), request));
    }
}
