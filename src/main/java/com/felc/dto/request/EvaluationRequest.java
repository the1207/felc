package com.felc.dto.request;

import com.felc.enums.StatutSoumission;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record EvaluationRequest(
        @NotNull StatutSoumission statut,
        @Min(0) @Max(100) Integer note,
        String feedback
) {}
