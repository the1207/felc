package com.felc.config;

import com.felc.entity.Domaine;
import com.felc.entity.MessageForum;
import com.felc.entity.SujetForum;
import com.felc.entity.User;
import com.felc.enums.Role;
import com.felc.repository.DomaineRepository;
import com.felc.repository.MessageForumRepository;
import com.felc.repository.SujetForumRepository;
import com.felc.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@Profile("dev")
@Order(4)
public class DemoForumLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DomaineRepository domaineRepository;
    private final SujetForumRepository sujetForumRepository;
    private final MessageForumRepository messageForumRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoForumLoader(UserRepository userRepository,
                           DomaineRepository domaineRepository,
                           SujetForumRepository sujetForumRepository,
                           MessageForumRepository messageForumRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.domaineRepository = domaineRepository;
        this.sujetForumRepository = sujetForumRepository;
        this.messageForumRepository = messageForumRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (sujetForumRepository.count() > 0) {
            return;
        }

        Domaine info = domaineRepository.findByCodeIgnoreCase("INFO").orElse(null);
        Domaine mkt = domaineRepository.findByCodeIgnoreCase("MKT").orElse(null);
        User formateur = userRepository.findByEmail("formateur@felc.com").orElse(null);

        // Créer un compte apprenant démo pour poser une question si pas encore présent
        User apprenant = userRepository.findByEmail("apprenant@felc.com").orElseGet(() -> {
            User u = new User();
            u.setEmail("apprenant@felc.com");
            u.setMotDePasse(passwordEncoder.encode("apprenant123"));
            u.setNom("Koffi");
            u.setPrenom("Jean");
            u.setRole(Role.APPRENANT);
            return userRepository.save(u);
        });

        // Sujet 1 : Question d'un apprenant avec réponse d'un formateur (résolu)
        SujetForum sujet1 = new SujetForum();
        sujet1.setTitre("Comment gérer les variables d'environnement pour PostgreSQL en production ?");
        sujet1.setContenu("Bonjour la communauté ! Lors du déploiement de mon API Spring Boot sur Render/Railway, quelle est la bonne pratique pour injecter DB_URL sans exposer les identifiants ?");
        sujet1.setAuteur(apprenant);
        sujet1.setDomaine(info);
        sujet1.setResolu(true);
        sujet1.setNbReponses(1);
        sujet1.setDateCreation(LocalDateTime.now().minusDays(2));
        sujet1.setDateDerniereActivite(LocalDateTime.now().minusDays(1));
        sujet1 = sujetForumRepository.save(sujet1);

        if (formateur != null) {
            MessageForum reponse1 = new MessageForum();
            reponse1.setSujet(sujet1);
            reponse1.setAuteur(formateur);
            reponse1.setContenu("Salut Jean ! Il faut configurer des variables d'environnement directement dans le tableau de bord de ton hébergeur (Settings > Environment Variables). Spring Boot les résout automatiquement via la syntaxe ${DB_URL} dans application.yml. Ne commit jamais de mot de passe dans git !");
            reponse1.setEstSolution(true);
            reponse1.setDateCreation(LocalDateTime.now().minusDays(1));
            messageForumRepository.save(reponse1);
        }

        // Sujet 2 : Conseil d'expert en Marketing Digital
        if (formateur != null) {
            SujetForum sujet2 = new SujetForum();
            sujet2.setTitre("[Conseil Expert] Comment trouver ses premiers clients freelance au Togo et dans la sous-région ?");
            sujet2.setContenu("Chers apprenants, voici 3 leviers essentiels pour démarrer : 1. Activer votre portfolio FELC et partager le lien vérifié. 2. Créer une présence LinkedIn propre avec vos certificats. 3. Proposer des audits gratuits aux PME locales.");
            sujet2.setAuteur(formateur);
            sujet2.setDomaine(mkt);
            sujet2.setResolu(false);
            sujet2.setNbReponses(0);
            sujet2.setDateCreation(LocalDateTime.now().minusHours(12));
            sujet2.setDateDerniereActivite(LocalDateTime.now().minusHours(12));
            sujetForumRepository.save(sujet2);
        }
    }
}
