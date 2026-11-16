package com.felc.repository;

import com.felc.entity.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CandidatureRepository extends JpaRepository<Candidature, Long> {
    boolean existsByUserIdAndOffreId(Long userId, Long offreId);
    List<Candidature> findByUserIdOrderByDateCandidatureDesc(Long userId);
    List<Candidature> findByOffreIdOrderByDateCandidatureDesc(Long offreId);
}
