package com.felc.dto.request;

import com.felc.enums.StatutCandidature;
import jakarta.validation.constraints.NotNull;

public record StatutCandidatureRequest(@NotNull StatutCandidature statut) {}
