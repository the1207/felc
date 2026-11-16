package com.felc.dto.response;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
