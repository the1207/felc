package com.felc.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "domaines")
@Getter @Setter @NoArgsConstructor
public class Domaine {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String nom;
    @Column(nullable = false, unique = true, length = 6)
    private String code;
    @Column(length = 1000)
    private String description;
}
