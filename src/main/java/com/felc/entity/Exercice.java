package com.felc.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "exercices")
@Getter @Setter @NoArgsConstructor
public class Exercice {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String titre;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String consigne;
    @Column(columnDefinition = "TEXT")
    private String criteres;
    @Column(nullable = false)
    private int ordre;
    @Column(nullable = false)
    private boolean projetFinal;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "formation_id")
    private Formation formation;
}
