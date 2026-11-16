package com.felc.mapper;

import com.felc.dto.response.CertificatResponse;
import com.felc.dto.response.CertificatVerificationResponse;
import com.felc.entity.Certificat;
import org.springframework.stereotype.Component;

@Component
public class CertificatMapper {

    public CertificatResponse toResponse(Certificat c) {
        return new CertificatResponse(c.getId(), c.getCodeUnique(), c.getFormation().getTitre(),
                c.getScore(), c.getDateEmission());
    }

    public CertificatVerificationResponse toVerification(Certificat c) {
        String apprenant = c.getUser().getPrenom() + " " + c.getUser().getNom();
        return new CertificatVerificationResponse(c.getCodeUnique(), apprenant, c.getFormation().getTitre(),
                c.getScore(), c.getDateEmission(), true);
    }
}
