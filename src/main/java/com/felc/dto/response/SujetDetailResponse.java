package com.felc.dto.response;

import com.felc.enums.Role;
import java.time.LocalDateTime;
import java.util.List;

public record SujetDetailResponse(
        Long id,
        String titre,
        String contenu,
        Long domaineId,
        String domaineNom,
        Long auteurId,
        String auteurNom,
        Role auteurRole,
        boolean resolu,
        int nbReponses,
        LocalDateTime dateCreation,
        LocalDateTime dateDerniereActivite,
        List<MessageForumResponse> messages
) {}
