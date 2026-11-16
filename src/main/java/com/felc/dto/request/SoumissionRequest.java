package com.felc.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SoumissionRequest(
        @NotBlank @Pattern(regexp = "^https?://.+", message = "Le lien doit commencer par http:// ou https://") String lienDepot,
        @Size(max = 2000) String commentaire
) {}
