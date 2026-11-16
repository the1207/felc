package com.felc.dto.response;

import com.felc.enums.Role;

import java.time.LocalDateTime;
import java.util.List;

public record UserResponse(
        Long id,
        String email,
        String nom,
        String prenom,
        Role role,
        String localisation,
        String bio,
        String lienGithub,
        String lienLinkedin,
        LocalDateTime dateInscription,
        List<UserCompetenceResponse> competences
) {
}
