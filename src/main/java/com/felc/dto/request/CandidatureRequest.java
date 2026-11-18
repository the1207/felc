package com.felc.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CandidatureRequest(
        @Size(max = 2000) String message,
        @Pattern(regexp = "^$|^https?://.+", message = "Le lien doit commencer par http:// ou https://") String lienPortfolio
) {}
