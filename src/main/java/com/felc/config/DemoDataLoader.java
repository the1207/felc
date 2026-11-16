package com.felc.config;

import com.felc.entity.Domaine;
import com.felc.entity.Exercice;
import com.felc.entity.Formation;
import com.felc.entity.Module;
import com.felc.entity.User;
import com.felc.enums.Niveau;
import com.felc.enums.Role;
import com.felc.repository.DomaineRepository;
import com.felc.repository.ExerciceRepository;
import com.felc.repository.FormationRepository;
import com.felc.repository.ModuleRepository;
import com.felc.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("dev")
@Order(1)
public class DemoDataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FormationRepository formationRepository;
    private final ModuleRepository moduleRepository;
    private final ExerciceRepository exerciceRepository;
    private final DomaineRepository domaineRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataLoader(UserRepository userRepository, FormationRepository formationRepository,
                          ModuleRepository moduleRepository, ExerciceRepository exerciceRepository,
                          DomaineRepository domaineRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.formationRepository = formationRepository;
        this.moduleRepository = moduleRepository;
        this.exerciceRepository = exerciceRepository;
        this.domaineRepository = domaineRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (formationRepository.count() > 0) {
            return;
        }

        User formateur = new User();
        formateur.setEmail("formateur@felc.com");
        formateur.setMotDePasse(passwordEncoder.encode("formateur123"));
        formateur.setNom("Demo");
        formateur.setPrenom("Formateur");
        formateur.setRole(Role.FORMATEUR);
        formateur = userRepository.save(formateur);

        Domaine informatique = creerDomaine("Informatique", "INFO", "Développement, bases de données, réseaux");
        creerDomaine("Marketing digital", "MKT", "Réseaux sociaux, publicité en ligne, création de contenu");
        creerDomaine("Agriculture", "AGRI", "Techniques agricoles, transformation et vente de produits");

        Formation api = creerFormation(formateur, "API REST avec Spring Boot : construis une API de gestion de tâches",
                "Formation 100 % pratique : tu codes une vraie API, exercice après exercice.",
                Niveau.INTERMEDIAIRE, informatique);
        creerModule(api, 1, "Démarrer le projet", "Génère un projet avec Spring Initializr (Web, JPA, PostgreSQL) et lance-le.");
        creerModule(api, 2, "Entité, repository, contrôleur", "Crée l'entité Tache, son repository et un contrôleur REST.");
        creerExercice(api, 1, false, "Crée le projet et lance-le",
                "Génère un projet Spring Boot et ajoute GET /api/ping qui renvoie {\"status\":\"ok\"}. Pousse le code sur GitHub.",
                "Le projet démarre. GET /api/ping renvoie status ok. Dépôt public avec un README.");
        creerExercice(api, 2, false, "CRUD des tâches",
                "Crée l'entité Tache (titre, terminee) et les 4 endpoints : créer, lister, modifier, supprimer.",
                "Les 4 endpoints fonctionnent dans Postman. Les données sont en base. Validation du titre.");
        creerExercice(api, 3, true, "Projet final : API complète",
                "Ajoute l'authentification JWT, la gestion des erreurs en JSON et déploie l'API en ligne.",
                "Routes protégées par token. Erreurs en JSON. API accessible en ligne avec un lien dans le README.");

        Formation angular = creerFormation(formateur, "Angular : construis une interface connectée à une API",
                "Formation 100 % pratique : tu construis une application Angular qui consomme une vraie API.",
                Niveau.DEBUTANT, informatique);
        creerModule(angular, 1, "Composants et données", "Crée un composant, affiche une liste et branche-la sur l'API.");
        creerModule(angular, 2, "Formulaires et appels HTTP", "Crée un formulaire réactif et envoie les données avec HttpClient.");
        creerExercice(angular, 1, false, "Affiche une liste",
                "Crée un composant qui récupère et affiche la liste des tâches de l'API.",
                "La liste s'affiche depuis l'API. Un message s'affiche si la liste est vide.");
        creerExercice(angular, 2, false, "Formulaire d'ajout",
                "Ajoute un formulaire avec validation qui crée une tâche via l'API.",
                "Le formulaire valide les champs. La nouvelle tâche apparaît dans la liste sans recharger la page.");
        creerExercice(angular, 3, true, "Projet final : mini-application",
                "Assemble liste, ajout, modification, suppression et connexion utilisateur, puis publie le tout.",
                "Toutes les actions fonctionnent. Connexion obligatoire. Application publiée avec un lien dans le README.");
    }

    private Formation creerFormation(User formateur, String titre, String description, Niveau niveau, Domaine domaine) {
        Formation f = new Formation();
        f.setTitre(titre);
        f.setDescription(description);
        f.setNiveau(niveau);
        f.setDomaine(domaine);
        f.setFormateur(formateur);
        return formationRepository.save(f);
    }

    private Domaine creerDomaine(String nom, String code, String description) {
        Domaine d = new Domaine();
        d.setNom(nom);
        d.setCode(code);
        d.setDescription(description);
        return domaineRepository.save(d);
    }

    private void creerModule(Formation formation, int ordre, String titre, String contenu) {
        Module m = new Module();
        m.setFormation(formation);
        m.setOrdre(ordre);
        m.setTitre(titre);
        m.setContenu(contenu);
        moduleRepository.save(m);
    }

    private void creerExercice(Formation formation, int ordre, boolean projetFinal, String titre,
                               String consigne, String criteres) {
        Exercice e = new Exercice();
        e.setFormation(formation);
        e.setOrdre(ordre);
        e.setProjetFinal(projetFinal);
        e.setTitre(titre);
        e.setConsigne(consigne);
        e.setCriteres(criteres);
        exerciceRepository.save(e);
    }
}
