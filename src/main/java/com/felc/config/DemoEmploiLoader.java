package com.felc.config;

import com.felc.entity.Domaine;
import com.felc.entity.Entreprise;
import com.felc.entity.Offre;
import com.felc.entity.User;
import com.felc.enums.Role;
import com.felc.enums.StatutOffre;
import com.felc.enums.TypeOffre;
import com.felc.repository.DomaineRepository;
import com.felc.repository.EntrepriseRepository;
import com.felc.repository.OffreRepository;
import com.felc.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("dev")
@Order(2)
public class DemoEmploiLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final OffreRepository offreRepository;
    private final DomaineRepository domaineRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoEmploiLoader(UserRepository userRepository, EntrepriseRepository entrepriseRepository,
                            OffreRepository offreRepository, DomaineRepository domaineRepository,
                            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.entrepriseRepository = entrepriseRepository;
        this.offreRepository = offreRepository;
        this.domaineRepository = domaineRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (offreRepository.count() > 0) {
            return;
        }
        Domaine informatique = domaineRepository.findByCodeIgnoreCase("INFO").orElse(null);
        Domaine marketing = domaineRepository.findByCodeIgnoreCase("MKT").orElse(null);
        if (informatique == null || marketing == null) {
            return;
        }

        User compte = new User();
        compte.setEmail("entreprise@felc.com");
        compte.setMotDePasse(passwordEncoder.encode("entreprise123"));
        compte.setNom("Demo");
        compte.setPrenom("Entreprise");
        compte.setRole(Role.ENTREPRISE);
        compte = userRepository.save(compte);

        Entreprise entreprise = new Entreprise();
        entreprise.setUser(compte);
        entreprise.setNom("TogoTech Solutions");
        entreprise.setSecteur("Services numériques");
        entreprise.setDescription("Agence de développement web et mobile basée à Lomé.");
        entreprise = entrepriseRepository.save(entreprise);

        creerOffre(entreprise, informatique, TypeOffre.EMPLOI, "Développeur Java Junior",
                "Rejoins notre équipe pour développer des API Spring Boot.", "Lomé, Togo", true, 0, null);
        creerOffre(entreprise, informatique, TypeOffre.MISSION, "Création d'une API REST",
                "Mission freelance : API de gestion de commandes avec authentification JWT.", "Remote", true, null, 100000);
        creerOffre(entreprise, marketing, TypeOffre.MISSION, "Community manager pour une boutique en ligne",
                "Animation de la page Facebook et Instagram pendant 3 mois.", "Lomé, Togo", false, null, 60000);
    }

    private void creerOffre(Entreprise entreprise, Domaine domaine, TypeOffre type, String titre,
                            String description, String localisation, boolean remote,
                            Integer experienceMin, Integer budget) {
        Offre o = new Offre();
        o.setEntreprise(entreprise);
        o.setDomaine(domaine);
        o.setType(type);
        o.setTitre(titre);
        o.setDescription(description);
        o.setLocalisation(localisation);
        o.setRemote(remote);
        o.setExperienceMin(experienceMin);
        o.setBudget(budget);
        o.setStatut(StatutOffre.OUVERTE);
        offreRepository.save(o);
    }
}
