package com.felc.dto.response;

import com.felc.enums.StatutCandidature;
import java.time.LocalDateTime;

public record CandidatureResponse(
        Long id, Long offreId, String offreTitre, String entrepriseNom,
        Long candidatId, String candidatNom, String candidatEmail,
        String message, String lienPortfolio, StatutCandidature statut, LocalDateTime dateCandidature
) {}
