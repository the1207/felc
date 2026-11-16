package com.felc.mapper;

import com.felc.dto.request.OffreRequest;
import com.felc.dto.response.OffreResponse;
import com.felc.entity.Domaine;
import com.felc.entity.Entreprise;
import com.felc.entity.Offre;
import com.felc.exception.ResourceNotFoundException;
import com.felc.repository.DomaineRepository;
import org.springframework.stereotype.Component;

@Component
public class OffreMapper {

    private final DomaineRepository domaineRepository;

    public OffreMapper(DomaineRepository domaineRepository) {
        this.domaineRepository = domaineRepository;
    }

    public Offre toEntity(OffreRequest request, Entreprise entreprise) {
        Offre offre = new Offre();
        apply(offre, request);
        offre.setEntreprise(entreprise);
        return offre;
    }

    public void apply(Offre offre, OffreRequest request) {
        Domaine domaine = domaineRepository.findById(request.domaineId())
                .orElseThrow(() -> new ResourceNotFoundException("Domaine introuvable"));
        offre.setTitre(request.titre().trim());
        offre.setDescription(request.description());
        offre.setType(request.type());
        offre.setDomaine(domaine);
        offre.setLocalisation(request.localisation());
        offre.setRemote(request.remote());
        offre.setExperienceMin(request.experienceMin());
        offre.setBudget(request.budget());
    }

    public OffreResponse toResponse(Offre o) {
        return new OffreResponse(o.getId(), o.getTitre(), o.getDescription(), o.getType(),
                o.getDomaine().getId(), o.getDomaine().getNom(),
                o.getEntreprise().getId(), o.getEntreprise().getNom(),
                o.getLocalisation(), o.isRemote(), o.getExperienceMin(), o.getBudget(),
                o.getStatut(), o.getDatePublication());
    }
}
