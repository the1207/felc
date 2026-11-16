package com.felc.service;

import com.felc.dto.response.InscriptionResponse;
import com.felc.entity.Formation;
import com.felc.entity.Inscription;
import com.felc.entity.Soumission;
import com.felc.entity.User;
import com.felc.enums.StatutInscription;
import com.felc.enums.StatutSoumission;
import com.felc.exception.ConflictException;
import com.felc.mapper.InscriptionMapper;
import com.felc.repository.ExerciceRepository;
import com.felc.repository.InscriptionRepository;
import com.felc.repository.SoumissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InscriptionService {

    private final InscriptionRepository inscriptionRepository;
    private final ExerciceRepository exerciceRepository;
    private final SoumissionRepository soumissionRepository;
    private final InscriptionMapper inscriptionMapper;
    private final CertificatService certificatService;
    private final AccessService accessService;

    public InscriptionService(InscriptionRepository inscriptionRepository,
                              ExerciceRepository exerciceRepository,
                              SoumissionRepository soumissionRepository,
                              InscriptionMapper inscriptionMapper,
                              CertificatService certificatService,
                              AccessService accessService) {
        this.inscriptionRepository = inscriptionRepository;
        this.exerciceRepository = exerciceRepository;
        this.soumissionRepository = soumissionRepository;
        this.inscriptionMapper = inscriptionMapper;
        this.certificatService = certificatService;
        this.accessService = accessService;
    }

    public InscriptionResponse inscrire(String email, Long formationId) {
        User user = accessService.currentUser(email);
        if (inscriptionRepository.findByUserIdAndFormationId(user.getId(), formationId).isPresent()) {
            throw new ConflictException("Tu es déjà inscrit à cette formation");
        }
        Inscription inscription = inscriptionMapper.toEntity(user, formationId);
        return inscriptionMapper.toResponse(inscriptionRepository.save(inscription));
    }

    @Transactional(readOnly = true)
    public List<InscriptionResponse> mesInscriptions(String email) {
        User user = accessService.currentUser(email);
        List<InscriptionResponse> result = new ArrayList<>();
        for (Inscription i : inscriptionRepository.findByUserId(user.getId())) {
            result.add(inscriptionMapper.toResponse(i));
        }
        return result;
    }

    /** Recalcule la progression. Quand tout est validé : TERMINEE + certificat. */
    public void mettreAJourProgression(User user, Formation formation) {
        Optional<Inscription> trouvee = inscriptionRepository
                .findByUserIdAndFormationId(user.getId(), formation.getId());
        if (trouvee.isEmpty()) {
            return;
        }
        Inscription inscription = trouvee.get();

        long total = exerciceRepository.countByFormationId(formation.getId());
        int valides = 0;
        int sommeNotes = 0;
        for (Soumission s : soumissionRepository.findByUserIdAndExerciceFormationId(user.getId(), formation.getId())) {
            if (s.getStatut() == StatutSoumission.VALIDEE) {
                valides++;
                if (s.getNote() != null) {
                    sommeNotes += s.getNote();
                }
            }
        }

        int progression = 0;
        if (total > 0) {
            progression = (int) (valides * 100L / total);
        }
        inscription.setProgression(progression);

        if (total > 0 && valides == total) {
            inscription.setStatut(StatutInscription.TERMINEE);
            certificatService.delivrerSiAbsent(user, formation, sommeNotes / valides);
        }
        inscriptionRepository.save(inscription);
    }
}
