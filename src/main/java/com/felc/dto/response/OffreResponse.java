package com.felc.dto.response;

import com.felc.enums.StatutOffre;
import com.felc.enums.TypeOffre;
import java.time.LocalDateTime;

public record OffreResponse(
        Long id, String titre, String description, TypeOffre type,
        Long domaineId, String domaine, Long entrepriseId, String entrepriseNom,
        String localisation, boolean remote, Integer experienceMin, Integer budget,
        StatutOffre statut, LocalDateTime datePublication
) {}
