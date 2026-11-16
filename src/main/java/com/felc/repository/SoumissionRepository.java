package com.felc.repository;

import com.felc.entity.Soumission;
import com.felc.enums.StatutSoumission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SoumissionRepository extends JpaRepository<Soumission, Long> {
    Optional<Soumission> findByUserIdAndExerciceId(Long userId, Long exerciceId);
    List<Soumission> findByUserId(Long userId);
    List<Soumission> findByUserIdAndExerciceFormationId(Long userId, Long formationId);
    List<Soumission> findByStatut(StatutSoumission statut);
    List<Soumission> findByExerciceFormationFormateurIdAndStatut(Long formateurId, StatutSoumission statut);
    long countByStatut(StatutSoumission statut);
}
