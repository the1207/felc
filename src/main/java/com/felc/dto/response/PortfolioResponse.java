package com.felc.dto.response;

import com.felc.enums.Niveau;
import java.time.LocalDateTime;
import java.util.List;

public record PortfolioResponse(
        Long id, String nom, String localisation, String bio, String lienGithub, String lienLinkedin,
        List<CompetenceItem> competences,
        List<FormationItem> formationsTerminees,
        List<CertificatItem> certificats,
        List<ProjetItem> projets
) {
    public record CompetenceItem(String nom, Niveau niveau) {}

    public record FormationItem(String titre, String domaine) {}

    public record CertificatItem(String codeUnique, String formationTitre, int score, LocalDateTime dateEmission) {}

    public record ProjetItem(String exerciceTitre, String formationTitre, String lienDepot,
                             Integer note, boolean projetFinal) {}
}
