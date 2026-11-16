package com.felc.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "recommandations")
@Getter
@Setter
@NoArgsConstructor
public class Recommandation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evaluation_id")
    private EvaluationProfil evaluation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "formation_id")
    private Formation formation;

    /** Position de la formation dans le parcours recommandé. */
    @Column(nullable = false)
    private int ordre;

    @Column(length = 1000)
    private String justification;
}
