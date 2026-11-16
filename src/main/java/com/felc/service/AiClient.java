package com.felc.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.felc.exception.ExternalServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiClient {

    private final RestClient client;
    private final ObjectMapper mapper;
    private final String apiKey;
    private final String model;

    public AiClient(ObjectMapper mapper,
                    @Value("${app.ai.api-key:}") String apiKey,
                    @Value("${app.ai.model}") String model) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(90000);
        this.client = RestClient.builder()
                .requestFactory(factory)
                .baseUrl("https://api.anthropic.com")
                .defaultHeader("x-api-key", apiKey == null ? "" : apiKey)
                .defaultHeader("anthropic-version", "2023-06-01")
                .defaultHeader("content-type", "application/json")
                .build();
        this.mapper = mapper;
        this.apiKey = apiKey;
        this.model = model;
    }

    /** Envoie une question et renvoie la réponse de l'IA lue comme un objet JSON. */
    public JsonNode demanderJson(String systemPrompt, String message, int maxTokens) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ExternalServiceException("L'assistant IA n'est pas configuré");
        }

        Map<String, Object> contenuMessage = new HashMap<>();
        contenuMessage.put("role", "user");
        contenuMessage.put("content", message);

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("max_tokens", maxTokens);
        body.put("system", systemPrompt);
        body.put("messages", List.of(contenuMessage));

        JsonNode reponse;
        try {
            reponse = client.post().uri("/v1/messages").body(body).retrieve().body(JsonNode.class);
        } catch (RestClientException e) {
            throw new ExternalServiceException("L'assistant IA est indisponible, réessaie dans un instant");
        }
        if (reponse == null) {
            throw new ExternalServiceException("Réponse vide de l'assistant IA");
        }

        String texte = reponse.path("content").path(0).path("text").asText();
        int debut = texte.indexOf('{');
        int fin = texte.lastIndexOf('}');
        if (debut < 0 || fin <= debut) {
            throw new ExternalServiceException("Réponse de l'assistant illisible, réessaie");
        }
        try {
            return mapper.readTree(texte.substring(debut, fin + 1));
        } catch (Exception e) {
            throw new ExternalServiceException("Réponse de l'assistant illisible, réessaie");
        }
    }
}
