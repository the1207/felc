package com.felc.dto.request;

import com.felc.enums.Niveau;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddCompetenceRequest(
        @NotBlank String nom,
        String categorie,
        @NotNull Niveau niveau
) {
}
