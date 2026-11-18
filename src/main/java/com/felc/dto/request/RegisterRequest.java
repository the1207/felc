package com.felc.dto.request;

import com.felc.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères") String motDePasse,
        @NotBlank String nom,
        @NotBlank String prenom,
        @NotNull Role role,
        String localisation,
        String nomEntreprise,
        String secteur,
        String siteWeb
) {
}
