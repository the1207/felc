package com.felc.service;

import com.felc.dto.response.CertificatResponse;
import com.felc.dto.response.CertificatVerificationResponse;
import com.felc.entity.Certificat;
import com.felc.entity.Formation;
import com.felc.entity.User;
import com.felc.exception.ResourceNotFoundException;
import com.felc.mapper.CertificatMapper;
import com.felc.repository.CertificatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CertificatService {

    private final CertificatRepository certificatRepository;
    private final CertificatMapper certificatMapper;
    private final AccessService accessService;

    public CertificatService(CertificatRepository certificatRepository,
                             CertificatMapper certificatMapper,
                             AccessService accessService) {
        this.certificatRepository = certificatRepository;
        this.certificatMapper = certificatMapper;
        this.accessService = accessService;
    }

    /** Crée le certificat s'il n'existe pas. Code final : FELC-<DOMAINE>-<id sur 6 chiffres>. */
    public void delivrerSiAbsent(User user, Formation formation, int score) {
        if (certificatRepository.existsByUserIdAndFormationId(user.getId(), formation.getId())) {
            return;
        }
        Certificat certificat = new Certificat();
        certificat.setUser(user);
        certificat.setFormation(formation);
        certificat.setScore(score);
        // Code temporaire unique : l'id n'existe qu'après le premier save.
        certificat.setCodeUnique(UUID.randomUUID().toString());
        certificat = certificatRepository.save(certificat);

        String code = "FELC-" + formation.getDomaine().getCode() + "-" + String.format("%06d", certificat.getId());
        certificat.setCodeUnique(code);
        certificatRepository.save(certificat);
    }

    @Transactional(readOnly = true)
    public List<CertificatResponse> mesCertificats(String email) {
        User user = accessService.currentUser(email);
        List<CertificatResponse> result = new ArrayList<>();
        for (Certificat c : certificatRepository.findByUserId(user.getId())) {
            result.add(certificatMapper.toResponse(c));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public CertificatVerificationResponse verifier(String code) {
        Certificat certificat = certificatRepository.findByCodeUnique(code.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Certificat introuvable"));
        return certificatMapper.toVerification(certificat);
    }
}
