package com.felc.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SujetRequest(
        @NotBlank @Size(max = 200, message = "Le titre ne doit pas dépasser 200 caractères") String titre,
        @NotBlank String contenu,
        Long domaineId
) {}
