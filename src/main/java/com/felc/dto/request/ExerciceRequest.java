package com.felc.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ExerciceRequest(
        @NotBlank String titre,
        @NotBlank String consigne,
        String criteres,
        @Min(1) int ordre,
        boolean projetFinal
) {}
