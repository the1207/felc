package com.felc.dto.response;

import com.felc.enums.Role;
import java.time.LocalDateTime;

public record AdminUserResponse(
        Long id, String nom, String prenom, String email, Role role, boolean actif, LocalDateTime dateInscription
) {}
