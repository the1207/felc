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
        Domaine agriculture = creerDomaine("Agriculture & Agrotech", "AGRI", "Techniques agricoles durables, irrigation solaire, transformation et traçabilité");
        Domaine energie = creerDomaine("Énergie Solaire & Green Tech", "ENER", "Dimensionnement photovoltaïque, micro-réseaux ruraux et transition énergétique");

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

        // Formation Agrotech & Climat (ODD 2 & 13)
        Formation agro = creerFormation(formateur, "Agrotechnologie : Automatisation d'Irrigation Solaire pour Maraîchage",
                "Formation 100% pratique pour le climat : code le pilotage automatique d'une pompe solaire à partir de capteurs d'humidité du sol.",
                Niveau.DEBUTANT, agriculture);
        creerModule(agro, 1, "Architecture du système IoT agricole", "Comprendre les capteurs d'humidité de sol, les relais 12V pour pompe solaire et le microcontrôleur ESP32.");
        creerModule(agro, 2, "Algorithme d'économie d'eau et seuils d'arrosage", "Calculer l'évapotranspiration et déclencher l'irrigation aux heures optimales.");
        creerExercice(agro, 1, false, "Lecture des capteurs et affichage",
                "Écris le script de lecture des sondes d'humidité et affiche l'état d'hydratation du sol.",
                "Code clair avec commentaires. Détection correcte des 3 plages (sec, optimal, saturé). Dépôt GitHub public.");
        creerExercice(agro, 2, false, "Pilotage de la vanne et sécurité thermique",
                "Implémente la logique d'activation de la pompe solaire avec coupure de sécurité en cas de réservoir vide.",
                "Arrêt automatique si niveau bas. Journalisation des cycles d'arrosage.");
        creerExercice(agro, 3, true, "Projet final : Contrôleur d'irrigation autonome",
                "Assemble le système complet avec tableau de bord web frugal permettant à la coopérative de suivre l'état de l'eau.",
                "Projet complet avec documentation d'installation terrain, schéma de câblage et code commenté.");

        // Formation Énergie Solaire Rurale (ODD 7 & 13)
        Formation solaire = creerFormation(formateur, "Énergie Solaire : Dimensionnement et Suivi IoT de Micro-Réseau Rural",
                "Formation pratique : dimensionne une installation photovoltaïque autonome et développe son tableau de bord de télémétrie.",
                Niveau.INTERMEDIAIRE, energie);
        creerModule(solaire, 1, "Bilan des puissances et dimensionnement", "Calculer les besoins journaliers en Wh, l'ensoleillement régional au Togo (kWh/m²/j) et le parc de batteries.");
        creerModule(solaire, 2, "Télémétrie et prévention des pannes", "Collecter les données de tension, courant et état de charge (SOC) pour éviter les coupures de courant.");
        creerExercice(solaire, 1, false, "Calculateur de dimensionnement solaire",
                "Crée un module ou script calculant le nombre de panneaux et la capacité de batterie nécessaire selon les appareils renseignés.",
                "Formules exactes respectant les normes de décharge (max 50% pour batteries plomb, 80% lithium). Code testé.");
        creerExercice(solaire, 2, false, "Alerte de tension critique",
                "Ajoute un système d'alerte immédiat lorsque la batterie descend sous le seuil critique pour préserver sa durée de vie.",
                "Déclenchement fiable de l'alerte. Gestion des seuils paramétrables.");
        creerExercice(solaire, 3, true, "Projet final : Dashboard de monitoring solaire frugal",
                "Développe un tableau de bord web léger affichant la production solaire journalière et l'autonomie restante.",
                "Interface basse consommation adaptée aux réseaux lents, code source disponible sur GitHub avec README.");
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
