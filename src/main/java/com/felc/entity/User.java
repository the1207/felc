package com.felc.entity;

import com.felc.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String motDePasse;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String localisation;

    @Column(length = 1000)
    private String bio;

    private String lienGithub;

    private String lienLinkedin;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean actif = true;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean portfolioPublic = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateInscription;

    @PrePersist
    void onCreate() {
        this.dateInscription = LocalDateTime.now();
    }
}
