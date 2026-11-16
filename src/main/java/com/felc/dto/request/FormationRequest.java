package com.felc.dto.request;

import com.felc.enums.Niveau;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FormationRequest(
        @NotBlank String titre,
        String description,
        @NotNull Niveau niveau,
        @NotNull Long domaineId
) {}
