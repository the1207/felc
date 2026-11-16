package com.felc.repository;

import com.felc.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, Long> {

    List<Module> findByFormationIdOrderByOrdreAsc(Long formationId);
}
