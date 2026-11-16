package com.felc.mapper;

import com.felc.dto.request.SujetRequest;
import com.felc.dto.response.MessageForumResponse;
import com.felc.dto.response.SujetDetailResponse;
import com.felc.dto.response.SujetResponse;
import com.felc.entity.Domaine;
import com.felc.entity.MessageForum;
import com.felc.entity.SujetForum;
import com.felc.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ForumMapper {

    public SujetForum toEntity(SujetRequest request, User auteur, Domaine domaine) {
        SujetForum sujet = new SujetForum();
        sujet.setTitre(request.titre().trim());
        sujet.setContenu(request.contenu().trim());
        sujet.setAuteur(auteur);
        sujet.setDomaine(domaine);
        return sujet;
    }

    public SujetResponse toResponse(SujetForum s) {
        String auteurNom = s.getAuteur().getPrenom() + " " + s.getAuteur().getNom();
        Long domaineId = s.getDomaine() != null ? s.getDomaine().getId() : null;
        String domaineNom = s.getDomaine() != null ? s.getDomaine().getNom() : "Général";

        return new SujetResponse(
                s.getId(),
                s.getTitre(),
                domaineId,
                domaineNom,
                s.getAuteur().getId(),
                auteurNom,
                s.getAuteur().getRole(),
                s.isResolu(),
                s.getNbReponses(),
                s.getDateCreation(),
                s.getDateDerniereActivite()
        );
    }

    public SujetDetailResponse toDetail(SujetForum s, List<MessageForumResponse> messages) {
        String auteurNom = s.getAuteur().getPrenom() + " " + s.getAuteur().getNom();
        Long domaineId = s.getDomaine() != null ? s.getDomaine().getId() : null;
        String domaineNom = s.getDomaine() != null ? s.getDomaine().getNom() : "Général";

        return new SujetDetailResponse(
                s.getId(),
                s.getTitre(),
                s.getContenu(),
                domaineId,
                domaineNom,
                s.getAuteur().getId(),
                auteurNom,
                s.getAuteur().getRole(),
                s.isResolu(),
                s.getNbReponses(),
                s.getDateCreation(),
                s.getDateDerniereActivite(),
                messages
        );
    }

    public MessageForumResponse toMessageResponse(MessageForum m) {
        String auteurNom = m.getAuteur().getPrenom() + " " + m.getAuteur().getNom();
        return new MessageForumResponse(
                m.getId(),
                m.getContenu(),
                m.getAuteur().getId(),
                auteurNom,
                m.getAuteur().getRole(),
                m.isEstSolution(),
                m.getDateCreation()
        );
    }
}
