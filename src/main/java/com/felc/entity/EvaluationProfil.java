package com.felc.entity;

import com.felc.enums.Niveau;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "evaluations_profil")
@Getter
@Setter
@NoArgsConstructor
public class EvaluationProfil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private Niveau niveauDetecte;

    private String objectifMetier;

    /** Heures disponibles par semaine. */
    private Integer tempsHebdo;

    /** Réponses brutes du questionnaire, au format JSON. */
    @Column(columnDefinition = "TEXT")
    private String reponsesJson;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateEvaluation;

    @PrePersist
    void onCreate() {
        this.dateEvaluation = LocalDateTime.now();
    }
}
