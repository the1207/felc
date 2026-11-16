package com.felc.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ModuleRequest(
        @NotBlank String titre,
        String contenu,
        @Min(1) int ordre
) {}
