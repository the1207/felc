package com.felc.mapper;

import com.felc.dto.request.DomaineRequest;
import com.felc.dto.response.DomaineResponse;
import com.felc.entity.Domaine;
import org.springframework.stereotype.Component;

@Component
public class DomaineMapper {

    public Domaine toEntity(DomaineRequest request) {
        Domaine domaine = new Domaine();
        domaine.setNom(request.nom().trim());
        domaine.setCode(request.code().trim().toUpperCase());
        domaine.setDescription(request.description());
        return domaine;
    }

    public DomaineResponse toResponse(Domaine d) {
        return new DomaineResponse(d.getId(), d.getNom(), d.getCode(), d.getDescription());
    }
}
