package com.felc.repository;

import com.felc.entity.MessageForum;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageForumRepository extends JpaRepository<MessageForum, Long> {

    List<MessageForum> findBySujetIdOrderByDateCreationAsc(Long sujetId);

    long countBySujetId(Long sujetId);
}
