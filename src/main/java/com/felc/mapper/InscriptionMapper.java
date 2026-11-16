package com.felc.mapper;

import com.felc.dto.response.InscriptionResponse;
import com.felc.entity.Formation;
import com.felc.entity.Inscription;
import com.felc.entity.User;
import com.felc.exception.ResourceNotFoundException;
import com.felc.repository.FormationRepository;
import org.springframework.stereotype.Component;

@Component
public class InscriptionMapper {

    private final FormationRepository formationRepository;

    public InscriptionMapper(FormationRepository formationRepository) {
        this.formationRepository = formationRepository;
    }

    public Inscription toEntity(User user, Long formationId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new ResourceNotFoundException("Formation introuvable"));
        Inscription inscription = new Inscription();
        inscription.setUser(user);
        inscription.setFormation(formation);
        inscription.setProgression(0);
        return inscription;
    }

    public InscriptionResponse toResponse(Inscription i) {
        return new InscriptionResponse(i.getId(), i.getFormation().getId(), i.getFormation().getTitre(),
                i.getProgression(), i.getStatut(), i.getDateDebut());
    }
}
