package com.felc.service;

import com.felc.dto.request.OffreRequest;
import com.felc.dto.request.StatutOffreRequest;
import com.felc.dto.response.OffreResponse;
import com.felc.entity.Entreprise;
import com.felc.entity.Offre;
import com.felc.entity.User;
import com.felc.enums.StatutOffre;
import com.felc.enums.TypeOffre;
import com.felc.exception.BadRequestException;
import com.felc.exception.ResourceNotFoundException;
import com.felc.mapper.OffreMapper;
import com.felc.repository.EntrepriseRepository;
import com.felc.repository.OffreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class OffreService {

    private final OffreRepository offreRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final OffreMapper offreMapper;
    private final AccessService accessService;

    public OffreService(OffreRepository offreRepository,
                        EntrepriseRepository entrepriseRepository,
                        OffreMapper offreMapper,
                        AccessService accessService) {
        this.offreRepository = offreRepository;
        this.entrepriseRepository = entrepriseRepository;
        this.offreMapper = offreMapper;
        this.accessService = accessService;
    }

    /** Offres ouvertes, avec filtres optionnels. Le filtrage se fait en Java : suffisant pour un prototype. */
    @Transactional(readOnly = true)
    public List<OffreResponse> lister(TypeOffre type, Long domaineId, Boolean remote, String q) {
        String recherche = null;
        if (q != null && !q.isBlank()) {
            recherche = q.trim().toLowerCase();
        }
        List<OffreResponse> result = new ArrayList<>();
        for (Offre o : offreRepository.findByStatutOrderByDatePublicationDesc(StatutOffre.OUVERTE)) {
            if (correspond(o, type, domaineId, remote, recherche)) {
                result.add(offreMapper.toResponse(o));
            }
        }
        return result;
    }

    @Transactional(readOnly = true)
    public OffreResponse detail(Long id) {
        return offreMapper.toResponse(trouver(id));
    }

    @Transactional(readOnly = true)
    public List<OffreResponse> mesOffres(String email) {
        User user = accessService.currentUser(email);
        List<OffreResponse> result = new ArrayList<>();
        for (Offre o : offreRepository.findByEntrepriseUserIdOrderByDatePublicationDesc(user.getId())) {
            result.add(offreMapper.toResponse(o));
        }
        return result;
    }

    public OffreResponse creer(String email, OffreRequest request) {
        User user = accessService.currentUser(email);
        Entreprise entreprise = entrepriseRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Aucun profil entreprise pour ce compte"));
        Offre offre = offreMapper.toEntity(request, entreprise);
        return offreMapper.toResponse(offreRepository.save(offre));
    }

    public OffreResponse modifier(String email, Long id, OffreRequest request) {
        User user = accessService.currentUser(email);
        Offre offre = trouver(id);
        accessService.checkEntrepriseOwnerOrAdmin(offre, user);
        offreMapper.apply(offre, request);
        return offreMapper.toResponse(offreRepository.save(offre));
    }

    public OffreResponse changerStatut(String email, Long id, StatutOffreRequest request) {
        User user = accessService.currentUser(email);
        Offre offre = trouver(id);
        accessService.checkEntrepriseOwnerOrAdmin(offre, user);
        offre.setStatut(request.statut());
        return offreMapper.toResponse(offreRepository.save(offre));
    }

    private Offre trouver(Long id) {
        return offreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offre introuvable"));
    }

    private boolean correspond(Offre o, TypeOffre type, Long domaineId, Boolean remote, String recherche) {
        if (type != null && o.getType() != type) {
            return false;
        }
        if (domaineId != null && !o.getDomaine().getId().equals(domaineId)) {
            return false;
        }
        if (remote != null && o.isRemote() != remote) {
            return false;
        }
        if (recherche != null) {
            boolean dansTitre = o.getTitre().toLowerCase().contains(recherche);
            boolean dansDescription = o.getDescription().toLowerCase().contains(recherche);
            if (!dansTitre && !dansDescription) {
                return false;
            }
        }
        return true;
    }
}
