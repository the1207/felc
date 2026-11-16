package com.felc.service;

import com.felc.dto.request.LoginRequest;
import com.felc.dto.request.RegisterRequest;
import com.felc.dto.response.AuthResponse;
import com.felc.dto.response.UserResponse;
import com.felc.entity.User;
import com.felc.enums.Role;
import com.felc.exception.BadRequestException;
import com.felc.exception.ConflictException;
import com.felc.exception.ResourceNotFoundException;
import com.felc.mapper.UserMapper;
import com.felc.repository.EntrepriseRepository;
import com.felc.repository.UserRepository;
import com.felc.security.JwtService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final UserService userService;

    public AuthService(UserRepository userRepository,
                       EntrepriseRepository entrepriseRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       UserMapper userMapper,
                       UserService userService) {
        this.userRepository = userRepository;
        this.entrepriseRepository = entrepriseRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userMapper = userMapper;
        this.userService = userService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.role() == Role.ADMIN) {
            throw new BadRequestException("Ce rôle ne peut pas être choisi à l'inscription");
        }

        String email = normalize(request.email());
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Cet email est déjà utilisé");
        }

        boolean nomEntrepriseVide = request.nomEntreprise() == null || request.nomEntreprise().isBlank();
        if (request.role() == Role.ENTREPRISE && nomEntrepriseVide) {
            throw new BadRequestException("Le nom de l'entreprise est obligatoire");
        }

        User user = userMapper.toEntity(request, email, passwordEncoder.encode(request.motDePasse()));
        user = userRepository.save(user);

        if (request.role() == Role.ENTREPRISE) {
            entrepriseRepository.save(userMapper.toEntreprise(user, request));
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        UserResponse userResponse = userMapper.toResponse(user, new ArrayList<>());
        return new AuthResponse(token, userResponse);
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalize(request.email());

        // Lève BadCredentialsException si l'email ou le mot de passe est faux.
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.motDePasse()));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        if (!user.isActif()) {
            throw new AccessDeniedException("Compte désactivé");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, userService.getProfile(email));
    }

    private String normalize(String email) {
        return email.trim().toLowerCase();
    }
}
