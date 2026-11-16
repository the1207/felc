package com.felc.mapper;

import com.felc.dto.request.SoumissionRequest;
import com.felc.dto.response.SoumissionResponse;
import com.felc.entity.Exercice;
import com.felc.entity.Soumission;
import com.felc.entity.User;
import com.felc.enums.StatutSoumission;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class SoumissionMapper {

    public Soumission toEntity(User user, Exercice exercice, SoumissionRequest request) {
        Soumission soumission = new Soumission();
        soumission.setUser(user);
        soumission.setExercice(exercice);
        soumission.setLienDepot(request.lienDepot().trim());
        soumission.setCommentaire(request.commentaire());
        soumission.setStatut(StatutSoumission.EN_ATTENTE);
        soumission.setDateSoumission(LocalDateTime.now());
        return soumission;
    }

    public SoumissionResponse toResponse(Soumission s) {
        String apprenant = s.getUser().getPrenom() + " " + s.getUser().getNom();
        return new SoumissionResponse(s.getId(), s.getExercice().getId(), s.getExercice().getTitre(),
                apprenant, s.getLienDepot(), s.getCommentaire(), s.getStatut(),
                s.getNote(), s.getFeedback(), s.getDateSoumission());
    }
}
