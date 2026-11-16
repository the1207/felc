package com.felc.repository;

import com.felc.entity.Offre;
import com.felc.enums.StatutOffre;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OffreRepository extends JpaRepository<Offre, Long> {
    List<Offre> findByStatutOrderByDatePublicationDesc(StatutOffre statut);
    List<Offre> findByEntrepriseUserIdOrderByDatePublicationDesc(Long userId);
    long countByStatut(StatutOffre statut);
}
