package com.felc.dto.response;

public record ExerciceResponse(
        Long id, String titre, String consigne, String criteres, int ordre, boolean projetFinal
) {}
