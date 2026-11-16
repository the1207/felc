package com.felc.service;

import com.felc.entity.Formation;
import com.felc.entity.Offre;
import com.felc.entity.User;
import com.felc.enums.Role;
import com.felc.exception.ResourceNotFoundException;
import com.felc.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class AccessService {

    private final UserRepository userRepository;

    public AccessService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User currentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
        if (!user.isActif()) {
            throw new AccessDeniedException("Compte désactivé");
        }
        return user;
    }

    public void checkOwnerOrAdmin(Formation formation, User user) {
        boolean admin = user.getRole() == Role.ADMIN;
        boolean proprietaire = formation.getFormateur().getId().equals(user.getId());
        if (!admin && !proprietaire) {
            throw new AccessDeniedException("Accès refusé");
        }
    }

    public void checkEntrepriseOwnerOrAdmin(Offre offre, User user) {
        boolean admin = user.getRole() == Role.ADMIN;
        boolean proprietaire = offre.getEntreprise().getUser().getId().equals(user.getId());
        if (!admin && !proprietaire) {
            throw new AccessDeniedException("Accès refusé");
        }
    }
}
