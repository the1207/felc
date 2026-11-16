package com.felc.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank String nom,
        @NotBlank String prenom,
        String localisation,
        @Size(max = 1000) String bio,
        String lienGithub,
        String lienLinkedin
) {
}
