package com.felc.mapper;

import com.felc.dto.request.ModuleRequest;
import com.felc.dto.response.ModuleResponse;
import com.felc.entity.Formation;
import com.felc.entity.Module;
import com.felc.exception.ResourceNotFoundException;
import com.felc.repository.FormationRepository;
import org.springframework.stereotype.Component;

@Component
public class ModuleMapper {

    private final FormationRepository formationRepository;

    public ModuleMapper(FormationRepository formationRepository) {
        this.formationRepository = formationRepository;
    }

    public Module toEntity(ModuleRequest request, Long formationId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new ResourceNotFoundException("Formation introuvable"));
        Module module = new Module();
        apply(module, request);
        module.setFormation(formation);
        return module;
    }

    public void apply(Module module, ModuleRequest request) {
        module.setTitre(request.titre().trim());
        module.setContenu(request.contenu());
        module.setOrdre(request.ordre());
    }

    public ModuleResponse toResponse(Module m) {
        return new ModuleResponse(m.getId(), m.getTitre(), m.getContenu(), m.getOrdre());
    }
}
