package com.felc.entity;

import com.felc.enums.StatutSoumission;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "soumissions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "exercice_id"}))
@Getter @Setter @NoArgsConstructor
public class Soumission {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "exercice_id")
    private Exercice exercice;
    @Column(nullable = false, length = 500)
    private String lienDepot;
    @Column(length = 2000)
    private String commentaire;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private StatutSoumission statut;
    private Integer note;
    @Column(columnDefinition = "TEXT")
    private String feedback;
    @Column(nullable = false)
    private LocalDateTime dateSoumission;

    @PrePersist
    void onCreate() {
        if (this.dateSoumission == null) { this.dateSoumission = LocalDateTime.now(); }
        if (this.statut == null) { this.statut = StatutSoumission.EN_ATTENTE; }
    }
}
