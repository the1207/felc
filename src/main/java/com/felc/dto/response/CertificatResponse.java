package com.felc.dto.response;

import java.time.LocalDateTime;

public record CertificatResponse(
        Long id, String codeUnique, String formationTitre, int score, LocalDateTime dateEmission
) {}
