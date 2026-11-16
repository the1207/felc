package com.felc.config;

import com.felc.entity.User;
import com.felc.enums.Role;
import com.felc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String email;
    private final String motDePasse;

    public AdminInitializer(UserRepository userRepository,
                            PasswordEncoder passwordEncoder,
                            @Value("${app.admin.email:}") String email,
                            @Value("${app.admin.password:}") String motDePasse) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.email = email;
        this.motDePasse = motDePasse;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (email == null || email.isBlank() || motDePasse == null || motDePasse.isBlank()) {
            return;
        }
        if (userRepository.findByEmail(email).isPresent()) {
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
}
