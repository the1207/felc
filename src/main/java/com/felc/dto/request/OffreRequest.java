package com.felc.dto.request;

import com.felc.enums.TypeOffre;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OffreRequest(
        @NotBlank String titre,
        @NotBlank String description,
        @NotNull TypeOffre type,
        @NotNull Long domaineId,
        String localisation,
        boolean remote,
        @Min(0) Integer experienceMin,
        @Min(0) Integer budget
) {}
