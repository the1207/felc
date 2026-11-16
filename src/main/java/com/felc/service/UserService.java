package com.felc.service;

import com.felc.dto.request.AddCompetenceRequest;
import com.felc.dto.request.UpdateProfileRequest;
import com.felc.dto.response.UserCompetenceResponse;
import com.felc.dto.response.UserResponse;
import com.felc.entity.Competence;
import com.felc.entity.User;
import com.felc.entity.UserCompetence;
import com.felc.exception.ResourceNotFoundException;
import com.felc.mapper.UserCompetenceMapper;
import com.felc.mapper.UserMapper;
import com.felc.repository.CompetenceRepository;
import com.felc.repository.UserCompetenceRepository;
import com.felc.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CompetenceRepository competenceRepository;
    private final UserCompetenceRepository userCompetenceRepository;
    private final UserMapper userMapper;
    private final UserCompetenceMapper userCompetenceMapper;

    public UserService(UserRepository userRepository,
                       CompetenceRepository competenceRepository,
                       UserCompetenceRepository userCompetenceRepository,
                       UserMapper userMapper,
                       UserCompetenceMapper userCompetenceMapper) {
        this.userRepository = userRepository;
        this.competenceRepository = competenceRepository;
        this.userCompetenceRepository = userCompetenceRepository;
        this.userMapper = userMapper;
        this.userCompetenceMapper = userCompetenceMapper;
    }

    @Transactional(readOnly = true)
    public UserResponse getProfile(String email) {
        User user = findUser(email);
        return buildResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = findUser(email);
        userMapper.applyProfile(user, request);
        userRepository.save(user);
        return buildResponse(user);
    }

    @Transactional
    public UserResponse addCompetence(String email, AddCompetenceRequest request) {
        User user = findUser(email);
        String nom = request.nom().trim();

        Competence competence;
        Optional<Competence> existing = competenceRepository.findByNomIgnoreCase(nom);
        if (existing.isPresent()) {
            competence = existing.get();
        } else {
            competence = new Competence();
            competence.setNom(nom);
            competence.setCategorie(request.categorie());
            competence = competenceRepository.save(competence);
        }

        Optional<UserCompetence> link = userCompetenceRepository
                .findByUserIdAndCompetenceId(user.getId(), competence.getId());
        if (link.isPresent()) {
            UserCompetence userCompetence = link.get();
            userCompetence.setNiveau(request.niveau());
            userCompetenceRepository.save(userCompetence);
        } else {
            UserCompetence userCompetence = userCompetenceMapper.toEntity(user, competence, request.niveau());
            userCompetenceRepository.save(userCompetence);
        }

        return buildResponse(user);
    }

    @Transactional
    public void removeCompetence(String email, Long userCompetenceId) {
        User user = findUser(email);
        UserCompetence userCompetence = userCompetenceRepository
                .findByIdAndUserId(userCompetenceId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Compétence introuvable sur ce profil"));
        userCompetenceRepository.delete(userCompetence);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
    }

    private UserResponse buildResponse(User user) {
        List<UserCompetenceResponse> competences = new ArrayList<>();
        for (UserCompetence userCompetence : userCompetenceRepository.findByUserId(user.getId())) {
            competences.add(userCompetenceMapper.toResponse(userCompetence));
        }
        return userMapper.toResponse(user, competences);
    }
}
