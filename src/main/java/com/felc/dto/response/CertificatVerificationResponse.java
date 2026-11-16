package com.felc.dto.response;

import java.time.LocalDateTime;

public record CertificatVerificationResponse(
        String codeUnique, String apprenantNom, String formationTitre,
        int score, LocalDateTime dateEmission, boolean valide
) {}
