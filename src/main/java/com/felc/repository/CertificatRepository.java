package com.felc.repository;

import com.felc.entity.Certificat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificatRepository extends JpaRepository<Certificat, Long> {

    Optional<Certificat> findByCodeUnique(String codeUnique);

    List<Certificat> findByUserId(Long userId);

    boolean existsByUserIdAndFormationId(Long userId, Long formationId);
}
