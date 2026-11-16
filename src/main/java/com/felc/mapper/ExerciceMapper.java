package com.felc.mapper;

import com.felc.dto.request.ExerciceRequest;
import com.felc.dto.response.ExerciceResponse;
import com.felc.entity.Exercice;
import com.felc.entity.Formation;
import com.felc.exception.ResourceNotFoundException;
import com.felc.repository.FormationRepository;
import org.springframework.stereotype.Component;

@Component
public class ExerciceMapper {

    private final FormationRepository formationRepository;

    public ExerciceMapper(FormationRepository formationRepository) {
        this.formationRepository = formationRepository;
    }

    public Exercice toEntity(ExerciceRequest request, Long formationId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new ResourceNotFoundException("Formation introuvable"));
        Exercice exercice = new Exercice();
        apply(exercice, request);
        exercice.setFormation(formation);
        return exercice;
    }

    public void apply(Exercice exercice, ExerciceRequest request) {
        exercice.setTitre(request.titre().trim());
        exercice.setConsigne(request.consigne());
        exercice.setCriteres(request.criteres());
        exercice.setOrdre(request.ordre());
        exercice.setProjetFinal(request.projetFinal());
    }

    public ExerciceResponse toResponse(Exercice e) {
        return new ExerciceResponse(e.getId(), e.getTitre(), e.getConsigne(), e.getCriteres(),
                e.getOrdre(), e.isProjetFinal());
    }
}
