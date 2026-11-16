package com.felc.dto.request;

import jakarta.validation.constraints.NotBlank;

public record MessageForumRequest(
        @NotBlank String contenu
) {}
