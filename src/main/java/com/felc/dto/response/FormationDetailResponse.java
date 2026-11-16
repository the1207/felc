package com.felc.dto.response;

import com.felc.enums.Niveau;
import java.util.List;

public record FormationDetailResponse(
        Long id, String titre, String description, Niveau niveau,
        Long domaineId, String domaine, String formateurNom,
        List<ModuleResponse> modules, List<ExerciceResponse> exercices
) {}
