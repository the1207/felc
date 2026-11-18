package com.felc.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.felc.enums.Niveau;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record OrientationRequest(
        @NotNull @JsonAlias("niveauActuel") Niveau niveau,
        @NotBlank @Size(max = 500) @JsonAlias("objectifs") String objectif,
        @Size(max = 200) String metier,
        @NotNull @Min(1) @Max(80) @JsonAlias("tempsDisponibleHeuresParSemaine") Integer heuresParSemaine,
        Long domaineId
) {}
