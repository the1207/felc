package com.felc.repository;

import com.felc.entity.EvaluationProfil;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EvaluationProfilRepository extends JpaRepository<EvaluationProfil, Long> {

    Optional<EvaluationProfil> findTopByUserIdOrderByDateEvaluationDesc(Long userId);
}
