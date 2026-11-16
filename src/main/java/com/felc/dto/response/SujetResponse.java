package com.felc.dto.response;

import com.felc.enums.Role;
import java.time.LocalDateTime;

public record SujetResponse(
        Long id,
        String titre,
        Long domaineId,
        String domaineNom,
        Long auteurId,
        String auteurNom,
        Role auteurRole,
        boolean resolu,
        int nbReponses,
        LocalDateTime dateCreation,
        LocalDateTime dateDerniereActivite
) {}
