package com.felc.service;

import com.felc.dto.request.MessageForumRequest;
import com.felc.dto.request.SujetRequest;
import com.felc.dto.response.MessageForumResponse;
import com.felc.dto.response.SujetDetailResponse;
import com.felc.dto.response.SujetResponse;
import com.felc.entity.Domaine;
import com.felc.entity.MessageForum;
import com.felc.entity.SujetForum;
import com.felc.entity.User;
import com.felc.enums.Role;
import com.felc.exception.BadRequestException;
import com.felc.exception.ResourceNotFoundException;
import com.felc.mapper.ForumMapper;
import com.felc.repository.DomaineRepository;
import com.felc.repository.MessageForumRepository;
import com.felc.repository.SujetForumRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ForumService {

    private final SujetForumRepository sujetForumRepository;
    private final MessageForumRepository messageForumRepository;
    private final DomaineRepository domaineRepository;
    private final ForumMapper forumMapper;
    private final AccessService accessService;

    public ForumService(SujetForumRepository sujetForumRepository,
                        MessageForumRepository messageForumRepository,
                        DomaineRepository domaineRepository,
                        ForumMapper forumMapper,
                        AccessService accessService) {
        this.sujetForumRepository = sujetForumRepository;
        this.messageForumRepository = messageForumRepository;
        this.domaineRepository = domaineRepository;
        this.forumMapper = forumMapper;
        this.accessService = accessService;
    }

    @Transactional(readOnly = true)
    public List<SujetResponse> listerSujets(Long domaineId, String q) {
        List<SujetForum> source;
        if (domaineId == null) {
            source = sujetForumRepository.findAllByOrderByDateDerniereActiviteDesc();
        } else {
            source = sujetForumRepository.findByDomaineIdOrderByDateDerniereActiviteDesc(domaineId);
        }

        String search = (q != null && !q.isBlank()) ? q.trim().toLowerCase() : null;
        List<SujetResponse> result = new ArrayList<>();
        for (SujetForum s : source) {
            if (search != null) {
                boolean dansTitre = s.getTitre().toLowerCase().contains(search);
                boolean dansContenu = s.getContenu().toLowerCase().contains(search);
                if (!dansTitre && !dansContenu) {
                    continue;
                }
            }
            result.add(forumMapper.toResponse(s));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public SujetDetailResponse detailSujet(Long id) {
        SujetForum sujet = trouverSujet(id);
        List<MessageForum> messages = messageForumRepository.findBySujetIdOrderByDateCreationAsc(id);
        List<MessageForumResponse> messageResponses = new ArrayList<>();
        for (MessageForum m : messages) {
            messageResponses.add(forumMapper.toMessageResponse(m));
        }
        return forumMapper.toDetail(sujet, messageResponses);
    }

    public SujetResponse creerSujet(String email, SujetRequest request) {
        User auteur = accessService.currentUser(email);
        Domaine domaine = null;
        if (request.domaineId() != null) {
            domaine = domaineRepository.findById(request.domaineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Domaine introuvable"));
        }
        SujetForum sujet = forumMapper.toEntity(request, auteur, domaine);
        return forumMapper.toResponse(sujetForumRepository.save(sujet));
    }

    public MessageForumResponse repondre(String email, Long sujetId, MessageForumRequest request) {
        User auteur = accessService.currentUser(email);
        SujetForum sujet = trouverSujet(sujetId);

        MessageForum message = new MessageForum();
        message.setSujet(sujet);
        message.setAuteur(auteur);
        message.setContenu(request.contenu().trim());
        MessageForum saved = messageForumRepository.save(message);

        sujet.setNbReponses(sujet.getNbReponses() + 1);
        sujet.setDateDerniereActivite(LocalDateTime.now());
        sujetForumRepository.save(sujet);

        return forumMapper.toMessageResponse(saved);
    }

    public MessageForumResponse marquerSolution(String email, Long sujetId, Long messageId) {
        User user = accessService.currentUser(email);
        SujetForum sujet = trouverSujet(sujetId);
        MessageForum message = messageForumRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message introuvable"));

        if (!message.getSujet().getId().equals(sujet.getId())) {
            throw new BadRequestException("Ce message n'appartient pas à ce sujet");
        }

        // Seul l'auteur du sujet, un formateur ou un admin peut valider la réponse comme solution
        boolean estAuteur = sujet.getAuteur().getId().equals(user.getId());
        boolean estExpertOuAdmin = user.getRole() == Role.FORMATEUR || user.getRole() == Role.ADMIN;
        if (!estAuteur && !estExpertOuAdmin) {
            throw new AccessDeniedException("Seul l'auteur du sujet ou un formateur peut marquer une solution");
        }

        // Réinitialiser les autres solutions éventuelles du sujet
        for (MessageForum m : messageForumRepository.findBySujetIdOrderByDateCreationAsc(sujetId)) {
            if (m.isEstSolution()) {
                m.setEstSolution(false);
                messageForumRepository.save(m);
            }
        }

        message.setEstSolution(true);
        sujet.setResolu(true);
        sujetForumRepository.save(sujet);

        return forumMapper.toMessageResponse(messageForumRepository.save(message));
    }

    public void supprimerSujet(String email, Long sujetId) {
        User user = accessService.currentUser(email);
        SujetForum sujet = trouverSujet(sujetId);

        boolean estAuteur = sujet.getAuteur().getId().equals(user.getId());
        boolean estAdmin = user.getRole() == Role.ADMIN;
        if (!estAuteur && !estAdmin) {
            throw new AccessDeniedException("Accès refusé");
        }

        List<MessageForum> messages = messageForumRepository.findBySujetIdOrderByDateCreationAsc(sujetId);
        messageForumRepository.deleteAll(messages);
        sujetForumRepository.delete(sujet);
    }

    public void supprimerMessage(String email, Long messageId) {
        User user = accessService.currentUser(email);
        MessageForum message = messageForumRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message introuvable"));

        boolean estAuteur = message.getAuteur().getId().equals(user.getId());
        boolean estAdmin = user.getRole() == Role.ADMIN;
        if (!estAuteur && !estAdmin) {
            throw new AccessDeniedException("Accès refusé");
        }

        SujetForum sujet = message.getSujet();
        messageForumRepository.delete(message);

        sujet.setNbReponses(Math.max(0, sujet.getNbReponses() - 1));
        if (message.isEstSolution()) {
            sujet.setResolu(false);
        }
        sujetForumRepository.save(sujet);
    }

    private SujetForum trouverSujet(Long id) {
        return sujetForumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sujet introuvable"));
    }
}
