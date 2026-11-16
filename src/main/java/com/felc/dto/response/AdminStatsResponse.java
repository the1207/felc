package com.felc.dto.response;

public record AdminStatsResponse(
        long utilisateurs, long apprenants, long formateurs, long entreprises,
        long formations, long inscriptions, long inscriptionsTerminees, long soumissionsEnAttente,
        long certificats, long offresOuvertes, long offresFermees, long candidatures
) {}
