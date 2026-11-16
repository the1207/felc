package com.felc.service;

import com.felc.dto.request.PortfolioVisibilite;
import com.felc.dto.response.PortfolioResponse;
import com.felc.entity.Certificat;
import com.felc.entity.Inscription;
import com.felc.entity.Soumission;
import com.felc.entity.User;
import com.felc.entity.UserCompetence;
import com.felc.enums.Role;
import com.felc.enums.StatutInscription;
import com.felc.enums.StatutSoumission;
import com.felc.exception.ResourceNotFoundException;
import com.felc.repository.CertificatRepository;
import com.felc.repository.InscriptionRepository;
import com.felc.repository.SoumissionRepository;
import com.felc.repository.UserCompetenceRepository;
import com.felc.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class PortfolioService {

    private final UserRepository userRepository;
    private final UserCompetenceRepository userCompetenceRepository;
    private final InscriptionRepository inscriptionRepository;
    private final CertificatRepository certificatRepository;
    private final SoumissionRepository soumissionRepository;
    private final AccessService accessService;

    public PortfolioService(UserRepository userRepository,
                            UserCompetenceRepository userCompetenceRepository,
                            InscriptionRepository inscriptionRepository,
                            CertificatRepository certificatRepository,
                            SoumissionRepository soumissionRepository,
                            AccessService accessService) {
        this.userRepository = userRepository;
        this.userCompetenceRepository = userCompetenceRepository;
        this.inscriptionRepository = inscriptionRepository;
        this.certificatRepository = certificatRepository;
        this.soumissionRepository = soumissionRepository;
        this.accessService = accessService;
    }

    /** Public : renvoie 404 si le portfolio n'existe pas ou n'est pas activé, sans distinguer les deux cas. */
    public PortfolioResponse portfolioPublic(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio introuvable"));
        if (user.getRole() != Role.APPRENANT || !user.isPortfolioPublic() || !user.isActif()) {
            throw new ResourceNotFoundException("Portfolio introuvable");
        }
        return construire(user);
    }

    public PortfolioResponse monPortfolio(String email) {
        return construire(accessService.currentUser(email));
    }

    @Transactional
    public PortfolioVisibilite definirVisibilite(String email, PortfolioVisibilite request) {
        User user = accessService.currentUser(email);
        user.setPortfolioPublic(request.visible());
        userRepository.save(user);
        return new PortfolioVisibilite(user.isPortfolioPublic());
    }

    private PortfolioResponse construire(User user) {
        List<PortfolioResponse.CompetenceItem> competences = new ArrayList<>();
        for (UserCompetence uc : userCompetenceRepository.findByUserId(user.getId())) {
            competences.add(new PortfolioResponse.CompetenceItem(uc.getCompetence().getNom(), uc.getNiveau()));
        }

        List<PortfolioResponse.FormationItem> formations = new ArrayList<>();
        for (Inscription i : inscriptionRepository.findByUserId(user.getId())) {
            if (i.getStatut() == StatutInscription.TERMINEE) {
                formations.add(new PortfolioResponse.FormationItem(
                        i.getFormation().getTitre(), i.getFormation().getDomaine().getNom()));
            }
        }

        List<PortfolioResponse.CertificatItem> certificats = new ArrayList<>();
        for (Certificat c : certificatRepository.findByUserId(user.getId())) {
            certificats.add(new PortfolioResponse.CertificatItem(
                    c.getCodeUnique(), c.getFormation().getTitre(), c.getScore(), c.getDateEmission()));
        }

        List<PortfolioResponse.ProjetItem> projets = new ArrayList<>();
        for (Soumission s : soumissionRepository.findByUserId(user.getId())) {
            if (s.getStatut() == StatutSoumission.VALIDEE) {
                projets.add(new PortfolioResponse.ProjetItem(
                        s.getExercice().getTitre(), s.getExercice().getFormation().getTitre(),
                        s.getLienDepot(), s.getNote(), s.getExercice().isProjetFinal()));
            }
        }

        return new PortfolioResponse(user.getId(), user.getPrenom() + " " + user.getNom(),
                user.getLocalisation(), user.getBio(), user.getLienGithub(), user.getLienLinkedin(),
                competences, formations, certificats, projets);
    }
}
