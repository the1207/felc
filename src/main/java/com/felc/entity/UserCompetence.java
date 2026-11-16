package com.felc.entity;

import com.felc.enums.Niveau;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_competences",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "competence_id"}))
@Getter
@Setter
@NoArgsConstructor
public class UserCompetence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "competence_id")
    private Competence competence;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Niveau niveau;
}
