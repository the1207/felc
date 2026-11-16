package com.felc.mapper;

import com.felc.dto.request.CandidatureRequest;
import com.felc.dto.response.CandidatureResponse;
import com.felc.entity.Candidature;
import com.felc.entity.Offre;
import com.felc.entity.User;
import org.springframework.stereotype.Component;

@Component
public class CandidatureMapper {

    public Candidature toEntity(User user, Offre offre, CandidatureRequest request) {
        Candidature candidature = new Candidature();
        candidature.setUser(user);
        candidature.setOffre(offre);
        candidature.setMessage(request.message());
        if (request.lienPortfolio() != null) {
            candidature.setLienPortfolio(request.lienPortfolio().trim());
        }
        return candidature;
    }

    public CandidatureResponse toResponse(Candidature c) {
        User u = c.getUser();
        return new CandidatureResponse(c.getId(), c.getOffre().getId(), c.getOffre().getTitre(),
                c.getOffre().getEntreprise().getNom(), u.getId(), u.getPrenom() + " " + u.getNom(),
                u.getEmail(), c.getMessage(), c.getLienPortfolio(), c.getStatut(), c.getDateCandidature());
    }
}
