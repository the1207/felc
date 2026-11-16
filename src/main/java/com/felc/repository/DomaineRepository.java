package com.felc.repository;

import com.felc.entity.Domaine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DomaineRepository extends JpaRepository<Domaine, Long> {
    boolean existsByNomIgnoreCase(String nom);
    boolean existsByCodeIgnoreCase(String code);
    Optional<Domaine> findByCodeIgnoreCase(String code);
}
