package com.felc.dto.response;

import com.felc.enums.Niveau;

public record FormationResponse(
        Long id, String titre, String description, Niveau niveau,
        Long domaineId, String domaine, String formateurNom
) {}
