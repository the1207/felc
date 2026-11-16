package com.felc.dto.response;

import com.felc.enums.Niveau;

public record UserCompetenceResponse(
        Long id,
        Long competenceId,
        String nom,
        String categorie,
        Niveau niveau
) {
}
