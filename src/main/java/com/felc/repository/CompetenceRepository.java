package com.felc.repository;

import com.felc.entity.Competence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompetenceRepository extends JpaRepository<Competence, Long> {

    Optional<Competence> findByNomIgnoreCase(String nom);
}
