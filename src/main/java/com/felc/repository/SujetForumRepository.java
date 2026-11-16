package com.felc.repository;

import com.felc.entity.SujetForum;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SujetForumRepository extends JpaRepository<SujetForum, Long> {

    List<SujetForum> findAllByOrderByDateDerniereActiviteDesc();

    List<SujetForum> findByDomaineIdOrderByDateDerniereActiviteDesc(Long domaineId);

    List<SujetForum> findByAuteurIdOrderByDateCreationDesc(Long auteurId);
}
