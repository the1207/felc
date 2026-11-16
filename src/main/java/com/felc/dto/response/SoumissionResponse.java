package com.felc.dto.response;

import com.felc.enums.StatutSoumission;
import java.time.LocalDateTime;

public record SoumissionResponse(
        Long id, Long exerciceId, String exerciceTitre, String apprenantNom,
        String lienDepot, String commentaire, StatutSoumission statut,
        Integer note, String feedback, LocalDateTime dateSoumission
) {}
