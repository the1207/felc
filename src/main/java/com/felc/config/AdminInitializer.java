package com.felc.config;

import com.felc.entity.Entreprise;
import com.felc.entity.User;
import com.felc.enums.Role;
import com.felc.repository.EntrepriseRepository;
import com.felc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final PasswordEncoder passwordEncoder;
    private final String email;
    private final String motDePasse;

    public AdminInitializer(UserRepository userRepository,
                            EntrepriseRepository entrepriseRepository,
                            PasswordEncoder passwordEncoder,
                            @Value("${app.admin.email:}") String email,
                            @Value("${app.admin.password:}") String motDePasse) {
        this.userRepository = userRepository;
        this.entrepriseRepository = entrepriseRepository;
        this.passwordEncoder = passwordEncoder;
        this.email = email;
        this.motDePasse = motDePasse;
    }

    @Override
    @Transactional
    public void run(String... args) {
        ensureCompte("admin1", "admin123", "Admin", "1", Role.ADMIN);
        ensureCompte("formateur1", "formateur123", "Formateur", "1", Role.FORMATEUR);
        ensureCompte("entreprise1", "entreprise123", "Entreprise", "1", Role.ENTREPRISE);
        ensureCompte("apprenant1", "apprenant123", "Apprenant", "1", Role.APPRENANT);
        if (email == null || email.isBlank() || motDePasse == null || motDePasse.isBlank()) {
            return;
        }
        if (email.equalsIgnoreCase("admin1") || userRepository.findByEmail(email).isPresent()) {
            return;
        }
        User admin = new User();
        admin.setEmail(email);
        admin.setMotDePasse(passwordEncoder.encode(motDePasse));
        admin.setNom("Admin");
        admin.setPrenom("FELC");
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);
    }

    private void ensureCompte(String identifiant, String motDePasse, String prenom, String nom, Role role) {
        User compte = userRepository.findByEmail(identifiant).orElseGet(User::new);
        compte.setEmail(identifiant);
        compte.setMotDePasse(passwordEncoder.encode(motDePasse));
        compte.setPrenom(prenom);
        compte.setNom(nom);
        compte.setRole(role);
        compte.setActif(true);
        compte = userRepository.save(compte);
        if (role == Role.ENTREPRISE && entrepriseRepository.findByUserId(compte.getId()).isEmpty()) {
            Entreprise entreprise = new Entreprise();
            entreprise.setUser(compte);
            entreprise.setNom("Entreprise 1");
            entreprise.setSecteur("Services");
            entreprise.setDescription("Compte de démonstration.");
            entrepriseRepository.save(entreprise);
        }
    }
}
