package com.felc.entity;

import com.felc.enums.StatutCandidature;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidatures",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "offre_id"}))
@Getter @Setter @NoArgsConstructor
public class Candidature {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "offre_id")
    private Offre offre;
    @Column(length = 2000)
    private String message;
    @Column(length = 500)
    private String lienPortfolio;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private StatutCandidature statut;
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCandidature;

    @PrePersist
    void onCreate() {
        this.dateCandidature = LocalDateTime.now();
        if (this.statut == null) { this.statut = StatutCandidature.ENVOYEE; }
    }
}
