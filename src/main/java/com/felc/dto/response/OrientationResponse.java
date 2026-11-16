package com.felc.dto.response;

import com.felc.enums.Niveau;
import java.util.List;

public record OrientationResponse(
        Niveau niveauEstime,
        String resume,
        List<String> competencesAAcquerir,
        List<EtapeParcours> parcours,
        List<String> projets,
        int dureeEstimeeSemaines,
        List<OffreResponse> opportunites
) {
    public record EtapeParcours(Long formationId, String titre, Niveau niveau, String domaine, String raison) {}
}
