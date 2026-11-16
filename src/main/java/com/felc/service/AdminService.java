package com.felc.service;

import com.felc.dto.request.ActivationRequest;
import com.felc.dto.response.AdminStatsResponse;
import com.felc.dto.response.AdminUserResponse;
import com.felc.dto.response.OffreResponse;
import com.felc.entity.Offre;
import com.felc.entity.User;
import com.felc.enums.Role;
import com.felc.enums.StatutInscription;
import com.felc.enums.StatutOffre;
import com.felc.enums.StatutSoumission;
import com.felc.exception.BadRequestException;
import com.felc.exception.ResourceNotFoundException;
import com.felc.mapper.OffreMapper;
import com.felc.repository.CandidatureRepository;
import com.felc.repository.CertificatRepository;
import com.felc.repository.EntrepriseRepository;
import com.felc.repository.FormationRepository;
import com.felc.repository.InscriptionRepository;
import com.felc.repository.OffreRepository;
import com.felc.repository.SoumissionRepository;
import com.felc.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final FormationRepository formationRepository;
    private final InscriptionRepository inscriptionRepository;
    private final SoumissionRepository soumissionRepository;
    private final CertificatRepository certificatRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final OffreRepository offreRepository;
    private final CandidatureRepository candidatureRepository;
    private final OffreMapper offreMapper;
    private final AccessService accessService;

    public AdminService(UserRepository userRepository,
                        FormationRepository formationRepository,
                        InscriptionRepository inscriptionRepository,
                        SoumissionRepository soumissionRepository,
                        CertificatRepository certificatRepository,
                        EntrepriseRepository entrepriseRepository,
                        OffreRepository offreRepository,
                        CandidatureRepository candidatureRepository,
                        OffreMapper offreMapper,
                        AccessService accessService) {
        this.userRepository = userRepository;
        this.formationRepository = formationRepository;
        this.inscriptionRepository = inscriptionRepository;
        this.soumissionRepository = soumissionRepository;
        this.certificatRepository = certificatRepository;
        this.entrepriseRepository = entrepriseRepository;
        this.offreRepository = offreRepository;
        this.candidatureRepository = candidatureRepository;
        this.offreMapper = offreMapper;
        this.accessService = accessService;
    }

    public AdminStatsResponse stats() {
        return new AdminStatsResponse(
                userRepository.count(),
                userRepository.countByRole(Role.APPRENANT),
                userRepository.countByRole(Role.FORMATEUR),
                entrepriseRepository.count(),
                formationRepository.count(),
                inscriptionRepository.count(),
                inscriptionRepository.countByStatut(StatutInscription.TERMINEE),
                soumissionRepository.countByStatut(StatutSoumission.EN_ATTENTE),
                certificatRepository.count(),
                offreRepository.countByStatut(StatutOffre.OUVERTE),
                offreRepository.countByStatut(StatutOffre.FERMEE),
                candidatureRepository.count());
    }

    public List<AdminUserResponse> utilisateurs(Role role) {
        List<User> users;
        if (role == null) {
            users = userRepository.findAll();
        } else {
            users = userRepository.findByRole(role);
        }
        List<AdminUserResponse> result = new ArrayList<>();
        for (User u : users) {
            result.add(versReponse(u));
        }
        return result;
    }

    @Transactional
    public AdminUserResponse changerActivation(String email, Long id, ActivationRequest request) {
        User admin = accessService.currentUser(email);
        User cible = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
        if (cible.getId().equals(admin.getId())) {
            throw new BadRequestException("Tu ne peux pas modifier l'état de ton propre compte");
        }
        cible.setActif(request.actif());
        return versReponse(userRepository.save(cible));
    }

    /** Toutes les offres, y compris fermées, pour la modération. */
    public List<OffreResponse> offres() {
        List<OffreResponse> result = new ArrayList<>();
        for (Offre o : offreRepository.findAll()) {
            result.add(offreMapper.toResponse(o));
        }
        return result;
    }

    private AdminUserResponse versReponse(User u) {
        return new AdminUserResponse(u.getId(), u.getNom(), u.getPrenom(), u.getEmail(),
                u.getRole(), u.isActif(), u.getDateInscription());
    }
}
