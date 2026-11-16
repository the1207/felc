package com.felc.dto.response;

import com.felc.enums.StatutInscription;
import java.time.LocalDateTime;

public record InscriptionResponse(
        Long id, Long formationId, String formationTitre, int progression,
        StatutInscription statut, LocalDateTime dateDebut
) {}
