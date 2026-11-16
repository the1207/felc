package com.felc.repository;

import com.felc.entity.Formation;
import com.felc.enums.Niveau;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormationRepository extends JpaRepository<Formation, Long> {

    List<Formation> findByNiveau(Niveau niveau);

    List<Formation> findByFormateurId(Long formateurId);

    List<Formation> findByDomaineId(Long domaineId);

    List<Formation> findByNiveauAndDomaineId(Niveau niveau, Long domaineId);
}
