package com.felc.service;

import com.felc.dto.request.DomaineRequest;
import com.felc.dto.response.DomaineResponse;
import com.felc.entity.Domaine;
import com.felc.exception.ConflictException;
import com.felc.mapper.DomaineMapper;
import com.felc.repository.DomaineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class DomaineService {

    private final DomaineRepository domaineRepository;
    private final DomaineMapper domaineMapper;

    public DomaineService(DomaineRepository domaineRepository, DomaineMapper domaineMapper) {
        this.domaineRepository = domaineRepository;
        this.domaineMapper = domaineMapper;
    }

    @Transactional(readOnly = true)
    public List<DomaineResponse> lister() {
        List<DomaineResponse> result = new ArrayList<>();
        for (Domaine d : domaineRepository.findAll()) {
            result.add(domaineMapper.toResponse(d));
        }
        return result;
    }

    public DomaineResponse creer(DomaineRequest request) {
        if (domaineRepository.existsByNomIgnoreCase(request.nom().trim())) {
            throw new ConflictException("Ce domaine existe déjà");
        }
        if (domaineRepository.existsByCodeIgnoreCase(request.code().trim())) {
            throw new ConflictException("Ce code est déjà utilisé par un autre domaine");
        }
        return domaineMapper.toResponse(domaineRepository.save(domaineMapper.toEntity(request)));
    }
}
