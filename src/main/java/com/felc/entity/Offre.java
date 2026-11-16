package com.felc.entity;

import com.felc.enums.StatutOffre;
import com.felc.enums.TypeOffre;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "offres")
@Getter @Setter @NoArgsConstructor
public class Offre {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "entreprise_id")
    private Entreprise entreprise;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "domaine_id")
    private Domaine domaine;
    @Column(nullable = false)
    private String titre;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private TypeOffre type;
    private String localisation;
    @Column(nullable = false)
    private boolean remote;
    private Integer experienceMin;
    private Integer budget;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private StatutOffre statut;
    @Column(nullable = false, updatable = false)
    private LocalDateTime datePublication;

    @PrePersist
    void onCreate() {
        this.datePublication = LocalDateTime.now();
        if (this.statut == null) { this.statut = StatutOffre.OUVERTE; }
    }
}
