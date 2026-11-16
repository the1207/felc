package com.felc.dto.response;

import com.felc.enums.Role;
import java.time.LocalDateTime;

public record MessageForumResponse(
        Long id,
        String contenu,
        Long auteurId,
        String auteurNom,
        Role auteurRole,
        boolean estSolution,
        LocalDateTime dateCreation
) {}
