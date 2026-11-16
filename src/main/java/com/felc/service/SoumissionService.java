package com.felc.service;

import com.felc.dto.request.EvaluationRequest;
import com.felc.dto.request.SoumissionRequest;
import com.felc.dto.response.SoumissionResponse;
import com.felc.entity.Exercice;
import com.felc.entity.Formation;
import com.felc.entity.Soumission;
import com.felc.entity.User;
import com.felc.enums.Role;
import com.felc.enums.StatutSoumission;
import com.felc.exception.BadRequestException;
import com.felc.exception.ConflictException;
import com.felc.exception.ResourceNotFoundException;
import com.felc.mapper.SoumissionMapper;
import com.felc.repository.ExerciceRepository;
import com.felc.repository.InscriptionRepository;
import com.felc.repository.SoumissionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SoumissionService {

    private final SoumissionRepository soumissionRepository;
    private final ExerciceRepository exerciceRepository;
    private final InscriptionRepository inscriptionRepository;
    private final SoumissionMapper soumissionMapper;
    private final InscriptionService inscriptionService;
    private final AccessService accessService;
    private final GithubService githubService;
    private final AiEvaluationService aiEvaluationService;
    private final int seuilValidation;

    public SoumissionService(SoumissionRepository soumissionRepository,
                             ExerciceRepository exerciceRepository,
                             InscriptionRepository inscriptionRepository,
                             SoumissionMapper soumissionMapper,
                             InscriptionService inscriptionService,
                             AccessService accessService,
                             GithubService githubService,
                             AiEvaluationService aiEvaluationService,
                             @Value("${app.ai.seuil-validation:70}") int seuilValidation) {
        this.soumissionRepository = soumissionRepository;
        this.exerciceRepository = exerciceRepository;
        this.inscriptionRepository = inscriptionRepository;
        this.soumissionMapper = soumissionMapper;
        this.inscriptionService = inscriptionService;
        this.accessService = accessService;
        this.githubService = githubService;
        this.aiEvaluationService = aiEvaluationService;
        this.seuilValidation = seuilValidation;
    }

    public SoumissionResponse soumettre(String email, Long exerciceId, SoumissionRequest request) {
        User user = accessService.currentUser(email);
        Exercice exercice = exerciceRepository.findById(exerciceId)
                .orElseThrow(() -> new ResourceNotFoundException("Exercice introuvable"));

        Long formationId = exercice.getFormation().getId();
        if (inscriptionRepository.findByUserIdAndFormationId(user.getId(), formationId).isEmpty()) {
            throw new BadRequestException("Inscris-toi d'abord à cette formation");
        }

        Optional<Soumission> existante = soumissionRepository.findByUserIdAndExerciceId(user.getId(), exerciceId);
        Soumission soumission;
        if (existante.isPresent()) {
            soumission = existante.get();
            if (soumission.getStatut() == StatutSoumission.VALIDEE) {
                throw new ConflictException("Cet exercice est déjà validé");
            }
            soumission.setLienDepot(request.lienDepot().trim());
            soumission.setCommentaire(request.commentaire());
            soumission.setStatut(StatutSoumission.EN_ATTENTE);
            soumission.setNote(null);
            soumission.setFeedback(null);
            soumission.setDateSoumission(LocalDateTime.now());
        } else {
            soumission = soumissionMapper.toEntity(user, exercice, request);
        }
        return soumissionMapper.toResponse(soumissionRepository.save(soumission));
    }

    public SoumissionResponse evaluer(String email, Long soumissionId, EvaluationRequest request) {
        User evaluateur = accessService.currentUser(email);
        Soumission soumission = trouver(soumissionId);
        accessService.checkOwnerOrAdmin(soumission.getExercice().getFormation(), evaluateur);

        verifierEnAttente(soumission);
        if (request.statut() == StatutSoumission.EN_ATTENTE) {
            throw new BadRequestException("Le statut doit être VALIDEE ou A_REVOIR");
        }
        if (request.statut() == StatutSoumission.VALIDEE && request.note() == null) {
            throw new BadRequestException("La note est obligatoire pour valider");
        }

        appliquerEvaluation(soumission, request.statut(), request.note(), request.feedback());
        return soumissionMapper.toResponse(soumission);
    }

    /** Correction automatique : l'apprenant propriétaire, le formateur de la formation ou l'ADMIN peuvent la lancer. */
    public SoumissionResponse evaluerParIA(String email, Long soumissionId) {
        User user = accessService.currentUser(email);
        Soumission soumission = trouver(soumissionId);
        Formation formation = soumission.getExercice().getFormation();

        boolean proprietaire = soumission.getUser().getId().equals(user.getId());
        if (!proprietaire) {
            accessService.checkOwnerOrAdmin(formation, user);
        }
        verifierEnAttente(soumission);

        String contenuDepot = githubService.lireDepot(soumission.getLienDepot());
        AiEvaluationService.ResultatIA resultat = aiEvaluationService
                .evaluer(soumission.getExercice(), contenuDepot, soumission.getCommentaire());

        StatutSoumission statut;
        if (resultat.note() >= seuilValidation) {
            statut = StatutSoumission.VALIDEE;
        } else {
            statut = StatutSoumission.A_REVOIR;
        }
        appliquerEvaluation(soumission, statut, resultat.note(), "[Correction IA] " + resultat.feedback());
        return soumissionMapper.toResponse(soumission);
    }

    @Transactional(readOnly = true)
    public List<SoumissionResponse> mesSoumissions(String email) {
        User user = accessService.currentUser(email);
        return toResponses(soumissionRepository.findByUserId(user.getId()));
    }

    @Transactional(readOnly = true)
    public List<SoumissionResponse> aEvaluer(String email) {
        User user = accessService.currentUser(email);
        List<Soumission> soumissions;
        if (user.getRole() == Role.ADMIN) {
            soumissions = soumissionRepository.findByStatut(StatutSoumission.EN_ATTENTE);
        } else {
            soumissions = soumissionRepository
                    .findByExerciceFormationFormateurIdAndStatut(user.getId(), StatutSoumission.EN_ATTENTE);
        }
        return toResponses(soumissions);
    }

    private Soumission trouver(Long id) {
        return soumissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Soumission introuvable"));
    }

    private void verifierEnAttente(Soumission soumission) {
        if (soumission.getStatut() != StatutSoumission.EN_ATTENTE) {
            throw new ConflictException("Cette soumission a déjà été évaluée");
        }
    }

    private void appliquerEvaluation(Soumission soumission, StatutSoumission statut, Integer note, String feedback) {
        soumission.setStatut(statut);
        soumission.setNote(note);
        soumission.setFeedback(feedback);
        soumissionRepository.save(soumission);
        if (statut == StatutSoumission.VALIDEE) {
            inscriptionService.mettreAJourProgression(soumission.getUser(), soumission.getExercice().getFormation());
        }
    }

    private List<SoumissionResponse> toResponses(List<Soumission> soumissions) {
        List<SoumissionResponse> result = new ArrayList<>();
        for (Soumission s : soumissions) {
            result.add(soumissionMapper.toResponse(s));
        }
        return result;
    }
}
