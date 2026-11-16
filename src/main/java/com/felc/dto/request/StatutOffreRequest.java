package com.felc.dto.request;

import com.felc.enums.StatutOffre;
import jakarta.validation.constraints.NotNull;

public record StatutOffreRequest(@NotNull StatutOffre statut) {}
