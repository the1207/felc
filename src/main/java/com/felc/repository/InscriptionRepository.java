package com.felc.repository;

import com.felc.entity.Inscription;
import com.felc.enums.StatutInscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InscriptionRepository extends JpaRepository<Inscription, Long> {

    List<Inscription> findByUserId(Long userId);

    Optional<Inscription> findByUserIdAndFormationId(Long userId, Long formationId);

    long countByStatut(StatutInscription statut);
}
