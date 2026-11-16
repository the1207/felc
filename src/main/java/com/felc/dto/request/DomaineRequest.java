package com.felc.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record DomaineRequest(
        @NotBlank String nom,
        @NotBlank @Pattern(regexp = "^[A-Za-z0-9]{2,6}$", message = "Le code fait 2 à 6 lettres ou chiffres") String code,
        @Size(max = 1000) String description
) {}
