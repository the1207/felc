package com.felc.mapper;

import com.felc.dto.request.RegisterRequest;
import com.felc.dto.request.UpdateProfileRequest;
import com.felc.dto.response.UserCompetenceResponse;
import com.felc.dto.response.UserResponse;
import com.felc.entity.Entreprise;
import com.felc.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserMapper {

    public User toEntity(RegisterRequest request, String email, String motDePasseEncode) {
        User user = new User();
        user.setEmail(email);
        user.setMotDePasse(motDePasseEncode);
        user.setNom(request.nom().trim());
        user.setPrenom(request.prenom().trim());
        user.setRole(request.role());
        user.setLocalisation(request.localisation());
        return user;
    }

    public Entreprise toEntreprise(User user, RegisterRequest request) {
        Entreprise entreprise = new Entreprise();
        entreprise.setUser(user);
        entreprise.setNom(request.nomEntreprise().trim());
        entreprise.setSecteur(request.secteur());
        entreprise.setSiteWeb(request.siteWeb());
        return entreprise;
    }

    public void applyProfile(User user, UpdateProfileRequest request) {
        user.setNom(request.nom().trim());
        user.setPrenom(request.prenom().trim());
        user.setLocalisation(request.localisation());
        user.setBio(request.bio());
        user.setLienGithub(request.lienGithub());
        user.setLienLinkedin(request.lienLinkedin());
    }

    public UserResponse toResponse(User user, List<UserCompetenceResponse> competences) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getNom(),
                user.getPrenom(),
                user.getRole(),
                user.getLocalisation(),
                user.getBio(),
                user.getLienGithub(),
                user.getLienLinkedin(),
                user.getDateInscription(),
                competences
        );
    }
}
