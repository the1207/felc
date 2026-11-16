package com.felc.dto.request;

import com.felc.enums.Niveau;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record OrientationRequest(
        @NotNull Niveau niveau,
        @NotBlank @Size(max = 500) String objectif,
        @Size(max = 200) String metier,
        @Min(1) @Max(80) int heuresParSemaine,
        Long domaineId
) {}
