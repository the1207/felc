package com.felc.service;

import com.felc.dto.request.ExerciceRequest;
import com.felc.dto.request.FormationRequest;
import com.felc.dto.request.ModuleRequest;
import com.felc.dto.response.ExerciceResponse;
import com.felc.dto.response.FormationDetailResponse;
import com.felc.dto.response.FormationResponse;
import com.felc.dto.response.ModuleResponse;
import com.felc.entity.Exercice;
import com.felc.entity.Formation;
import com.felc.entity.Module;
import com.felc.entity.User;
import com.felc.enums.Niveau;
import com.felc.exception.ResourceNotFoundException;
import com.felc.mapper.ExerciceMapper;
import com.felc.mapper.FormationMapper;
import com.felc.mapper.ModuleMapper;
import com.felc.repository.ExerciceRepository;
import com.felc.repository.FormationRepository;
import com.felc.repository.ModuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class FormationService {

    private final FormationRepository formationRepository;
    private final ModuleRepository moduleRepository;
    private final ExerciceRepository exerciceRepository;
    private final FormationMapper formationMapper;
    private final ModuleMapper moduleMapper;
    private final ExerciceMapper exerciceMapper;
    private final AccessService accessService;

    public FormationService(FormationRepository formationRepository,
                            ModuleRepository moduleRepository,
                            ExerciceRepository exerciceRepository,
                            FormationMapper formationMapper,
                            ModuleMapper moduleMapper,
                            ExerciceMapper exerciceMapper,
                            AccessService accessService) {
        this.formationRepository = formationRepository;
        this.moduleRepository = moduleRepository;
        this.exerciceRepository = exerciceRepository;
        this.formationMapper = formationMapper;
        this.moduleMapper = moduleMapper;
        this.exerciceMapper = exerciceMapper;
        this.accessService = accessService;
    }

    @Transactional(readOnly = true)
    public List<FormationResponse> lister(Niveau niveau, Long domaineId) {
        List<Formation> formations;
        if (niveau == null && domaineId == null) {
            formations = formationRepository.findAll();
        } else if (niveau != null && domaineId == null) {
            formations = formationRepository.findByNiveau(niveau);
        } else if (niveau == null) {
            formations = formationRepository.findByDomaineId(domaineId);
        } else {
            formations = formationRepository.findByNiveauAndDomaineId(niveau, domaineId);
        }
        List<FormationResponse> result = new ArrayList<>();
        for (Formation f : formations) {
            result.add(formationMapper.toResponse(f));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public FormationDetailResponse detail(Long id) {
        return buildDetail(findFormation(id));
    }

    public FormationResponse creer(String email, FormationRequest request) {
        User user = accessService.currentUser(email);
        Formation formation = formationMapper.toEntity(request, user);
        return formationMapper.toResponse(formationRepository.save(formation));
    }

    public FormationResponse modifier(String email, Long id, FormationRequest request) {
        User user = accessService.currentUser(email);
        Formation formation = findFormation(id);
        accessService.checkOwnerOrAdmin(formation, user);
        formationMapper.apply(formation, request);
        return formationMapper.toResponse(formationRepository.save(formation));
    }

    public ModuleResponse ajouterModule(String email, Long formationId, ModuleRequest request) {
        User user = accessService.currentUser(email);
        Module module = moduleMapper.toEntity(request, formationId);
        accessService.checkOwnerOrAdmin(module.getFormation(), user);
        return moduleMapper.toResponse(moduleRepository.save(module));
    }

    public ModuleResponse modifierModule(String email, Long moduleId, ModuleRequest request) {
        User user = accessService.currentUser(email);
        Module module = findModule(moduleId);
        accessService.checkOwnerOrAdmin(module.getFormation(), user);
        moduleMapper.apply(module, request);
        return moduleMapper.toResponse(moduleRepository.save(module));
    }

    public void supprimerModule(String email, Long moduleId) {
        User user = accessService.currentUser(email);
        Module module = findModule(moduleId);
        accessService.checkOwnerOrAdmin(module.getFormation(), user);
        moduleRepository.delete(module);
    }

    public ExerciceResponse ajouterExercice(String email, Long formationId, ExerciceRequest request) {
        User user = accessService.currentUser(email);
        Exercice exercice = exerciceMapper.toEntity(request, formationId);
        accessService.checkOwnerOrAdmin(exercice.getFormation(), user);
        return exerciceMapper.toResponse(exerciceRepository.save(exercice));
    }

    public ExerciceResponse modifierExercice(String email, Long exerciceId, ExerciceRequest request) {
        User user = accessService.currentUser(email);
        Exercice exercice = exerciceRepository.findById(exerciceId)
                .orElseThrow(() -> new ResourceNotFoundException("Exercice introuvable"));
        accessService.checkOwnerOrAdmin(exercice.getFormation(), user);
        exerciceMapper.apply(exercice, request);
        return exerciceMapper.toResponse(exerciceRepository.save(exercice));
    }

    private Formation findFormation(Long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Formation introuvable"));
    }

    private Module findModule(Long id) {
        return moduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Module introuvable"));
    }

    private FormationDetailResponse buildDetail(Formation formation) {
        List<ModuleResponse> modules = new ArrayList<>();
        for (Module m : moduleRepository.findByFormationIdOrderByOrdreAsc(formation.getId())) {
            modules.add(moduleMapper.toResponse(m));
        }
        List<ExerciceResponse> exercices = new ArrayList<>();
        for (Exercice e : exerciceRepository.findByFormationIdOrderByOrdreAsc(formation.getId())) {
            exercices.add(exerciceMapper.toResponse(e));
        }
        return formationMapper.toDetail(formation, modules, exercices);
    }
}
