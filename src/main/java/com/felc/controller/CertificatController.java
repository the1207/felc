package com.felc.controller;

import com.felc.dto.response.CertificatResponse;
import com.felc.dto.response.CertificatVerificationResponse;
import com.felc.service.CertificatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/certificats")
public class CertificatController {

    private final CertificatService certificatService;

    public CertificatController(CertificatService certificatService) {
        this.certificatService = certificatService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<CertificatResponse>> mesCertificats(Authentication auth) {
        return ResponseEntity.ok(certificatService.mesCertificats(auth.getName()));
    }

    @GetMapping("/verify/{code}")
    public ResponseEntity<CertificatVerificationResponse> verifier(@PathVariable String code) {
        return ResponseEntity.ok(certificatService.verifier(code));
    }
}
