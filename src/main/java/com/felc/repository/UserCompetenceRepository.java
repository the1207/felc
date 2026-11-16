package com.felc.repository;

import com.felc.entity.UserCompetence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserCompetenceRepository extends JpaRepository<UserCompetence, Long> {

    List<UserCompetence> findByUserId(Long userId);

    Optional<UserCompetence> findByUserIdAndCompetenceId(Long userId, Long competenceId);

    Optional<UserCompetence> findByIdAndUserId(Long id, Long userId);
}
