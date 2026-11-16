package com.felc.mapper;

import com.felc.dto.request.FormationRequest;
import com.felc.dto.response.ExerciceResponse;
import com.felc.dto.response.FormationDetailResponse;
import com.felc.dto.response.FormationResponse;
import com.felc.dto.response.ModuleResponse;
import com.felc.entity.Domaine;
import com.felc.entity.Formation;
import com.felc.entity.User;
import com.felc.exception.ResourceNotFoundException;
import com.felc.repository.DomaineRepository;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class FormationMapper {

    private final DomaineRepository domaineRepository;

    public FormationMapper(DomaineRepository domaineRepository) {
        this.domaineRepository = domaineRepository;
    }

    public Formation toEntity(FormationRequest request, User formateur) {
        Formation formation = new Formation();
        apply(formation, request);
        formation.setFormateur(formateur);
        return formation;
    }

    public void apply(Formation formation, FormationRequest request) {
        Domaine domaine = domaineRepository.findById(request.domaineId())
                .orElseThrow(() -> new ResourceNotFoundException("Domaine introuvable"));
        formation.setTitre(request.titre().trim());
        formation.setDescription(request.description());
        formation.setNiveau(request.niveau());
        formation.setDomaine(domaine);
    }

    public FormationResponse toResponse(Formation f) {
        return new FormationResponse(f.getId(), f.getTitre(), f.getDescription(), f.getNiveau(),
                f.getDomaine().getId(), f.getDomaine().getNom(), nomFormateur(f));
    }

    public FormationDetailResponse toDetail(Formation f, List<ModuleResponse> modules,
                                            List<ExerciceResponse> exercices) {
        return new FormationDetailResponse(f.getId(), f.getTitre(), f.getDescription(), f.getNiveau(),
                f.getDomaine().getId(), f.getDomaine().getNom(), nomFormateur(f), modules, exercices);
    }

    private String nomFormateur(Formation f) {
        return f.getFormateur().getPrenom() + " " + f.getFormateur().getNom();
    }
}
