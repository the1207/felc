package com.felc.repository;

import com.felc.entity.Recommandation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecommandationRepository extends JpaRepository<Recommandation, Long> {

    List<Recommandation> findByEvaluationIdOrderByOrdreAsc(Long evaluationId);
}
