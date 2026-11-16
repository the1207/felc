package com.felc.mapper;

import com.felc.dto.response.UserCompetenceResponse;
import com.felc.entity.Competence;
import com.felc.entity.User;
import com.felc.entity.UserCompetence;
import com.felc.enums.Niveau;
import org.springframework.stereotype.Component;

@Component
public class UserCompetenceMapper {

    public UserCompetence toEntity(User user, Competence competence, Niveau niveau) {
        UserCompetence userCompetence = new UserCompetence();
        userCompetence.setUser(user);
        userCompetence.setCompetence(competence);
        userCompetence.setNiveau(niveau);
        return userCompetence;
    }

    public UserCompetenceResponse toResponse(UserCompetence userCompetence) {
        Competence competence = userCompetence.getCompetence();
        return new UserCompetenceResponse(
                userCompetence.getId(),
                competence.getId(),
                competence.getNom(),
                competence.getCategorie(),
                userCompetence.getNiveau()
        );
    }
}
