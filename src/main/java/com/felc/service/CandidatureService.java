package com.felc.service;

import com.felc.dto.request.CandidatureRequest;
import com.felc.dto.request.StatutCandidatureRequest;
import com.felc.dto.response.CandidatureResponse;
import com.felc.entity.Candidature;
import com.felc.entity.Offre;
import com.felc.entity.User;
import com.felc.enums.StatutCandidature;
import com.felc.enums.StatutOffre;
import com.felc.exception.BadRequestException;
import com.felc.exception.ConflictException;
import com.felc.exception.ResourceNotFoundException;
import com.felc.mapper.CandidatureMapper;
import com.felc.repository.CandidatureRepository;
import com.felc.repository.OffreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class CandidatureService {

    private final CandidatureRepository candidatureRepository;
    private final OffreRepository offreRepository;
    private final CandidatureMapper candidatureMapper;
    private final AccessService accessService;

    public CandidatureService(CandidatureRepository candidatureRepository,
                              OffreRepository offreRepository,
                              CandidatureMapper candidatureMapper,
                              AccessService accessService) {
        this.candidatureRepository = candidatureRepository;
        this.offreRepository = offreRepository;
        this.candidatureMapper = candidatureMapper;
        this.accessService = accessService;
    }

    public CandidatureResponse postuler(String email, Long offreId, CandidatureRequest request) {
        User user = accessService.currentUser(email);
        Offre offre = trouverOffre(offreId);
        if (offre.getStatut() != StatutOffre.OUVERTE) {
            throw new BadRequestException("Cette offre est fermée");
        }
        if (candidatureRepository.existsByUserIdAndOffreId(user.getId(), offreId)) {
            throw new ConflictException("Tu as déjà postulé à cette offre");
        }
        Candidature candidature = candidatureMapper.toEntity(user, offre, request);
        return candidatureMapper.toResponse(candidatureRepository.save(candidature));
    }

    @Transactional(readOnly = true)
    public List<CandidatureResponse> mesCandidatures(String email) {
        User user = accessService.currentUser(email);
        return toResponses(candidatureRepository.findByUserIdOrderByDateCandidatureDesc(user.getId()));
    }

    @Transactional(readOnly = true)
    public List<CandidatureResponse> candidaturesDeLOffre(String email, Long offreId) {
        User user = accessService.currentUser(email);
        Offre offre = trouverOffre(offreId);
        accessService.checkEntrepriseOwnerOrAdmin(offre, user);
        return toResponses(candidatureRepository.findByOffreIdOrderByDateCandidatureDesc(offreId));
    }

    public CandidatureResponse changerStatut(String email, Long candidatureId, StatutCandidatureRequest request) {
        User user = accessService.currentUser(email);
        Candidature candidature = candidatureRepository.findById(candidatureId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidature introuvable"));
        accessService.checkEntrepriseOwnerOrAdmin(candidature.getOffre(), user);

        StatutCandidature actuel = candidature.getStatut();
        if (actuel == StatutCandidature.ACCEPTEE || actuel == StatutCandidature.REFUSEE) {
            throw new ConflictException("Cette candidature a déjà reçu une réponse définitive");
        }
        if (request.statut() == StatutCandidature.ENVOYEE) {
            throw new BadRequestException("Le statut doit être VUE, ACCEPTEE ou REFUSEE");
        }
        candidature.setStatut(request.statut());
        return candidatureMapper.toResponse(candidatureRepository.save(candidature));
    }

    private Offre trouverOffre(Long id) {
        return offreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offre introuvable"));
    }

    private List<CandidatureResponse> toResponses(List<Candidature> candidatures) {
        List<CandidatureResponse> result = new ArrayList<>();
        for (Candidature c : candidatures) {
            result.add(candidatureMapper.toResponse(c));
        }
        return result;
    }
}
