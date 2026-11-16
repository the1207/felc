package com.felc.entity;

import com.felc.enums.StatutInscription;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "inscriptions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "formation_id"}))
@Getter
@Setter
@NoArgsConstructor
public class Inscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "formation_id")
    private Formation formation;

    /** Progression en pourcentage (0 à 100). */
    @Column(nullable = false)
    private int progression;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutInscription statut;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateDebut;

    @PrePersist
    void onCreate() {
        this.dateDebut = LocalDateTime.now();
        if (this.statut == null) {
            this.statut = StatutInscription.EN_COURS;
        }
    }
}
