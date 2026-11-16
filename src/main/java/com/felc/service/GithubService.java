package com.felc.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.felc.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GithubService {

    private static final int MAX_FICHIERS = 12;
    private static final int MAX_CHARS_FICHIER = 4000;
    private static final int MAX_CHARS_TOTAL = 30000;
    private static final int MAX_LIGNES_ARBORESCENCE = 80;
    private static final Pattern LIEN = Pattern.compile(
            "^https?://github\\.com/([\\w.-]+)/([\\w.-]+?)(?:\\.git)?(?:/.*)?$");
    private static final Pattern CHEMIN_SUR = Pattern.compile("^[\\w./-]+$");
    private static final List<String> EXTENSIONS = List.of(
            ".java", ".ts", ".html", ".js", ".jsx", ".py", ".xml", ".yml", ".yaml",
            ".json", ".md", ".sql", ".properties", ".css", ".dart");
    private static final List<String> IGNORES = List.of(
            "node_modules/", "target/", "dist/", "build/", ".git/", ".idea/", "package-lock.json");

    private final RestClient client;

    public GithubService(@Value("${app.github.token:}") String token) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(20000);
        RestClient.Builder builder = RestClient.builder()
                .requestFactory(factory)
                .baseUrl("https://api.github.com")
                .defaultHeader("Accept", "application/vnd.github+json")
                .defaultHeader("User-Agent", "felc-app");
        if (token != null && !token.isBlank()) {
            builder.defaultHeader("Authorization", "Bearer " + token);
        }
        this.client = builder.build();
    }

    /** Renvoie un texte (arborescence + extraits de fichiers) à donner à l'IA. */
    public String lireDepot(String lien) {
        Matcher m = LIEN.matcher(lien.trim());
        if (!m.matches()) {
            throw new BadRequestException("Le lien doit pointer vers un dépôt GitHub (https://github.com/utilisateur/depot)");
        }
        String owner = m.group(1);
        String repo = m.group(2);

        JsonNode arbre;
        try {
            arbre = client.get()
                    .uri("/repos/" + owner + "/" + repo + "/git/trees/HEAD?recursive=1")
                    .retrieve()
                    .body(JsonNode.class);
        } catch (RestClientException e) {
            throw new BadRequestException("Dépôt introuvable, vide ou privé : rends-le public puis soumets à nouveau");
        }

        List<String> chemins = new ArrayList<>();
        if (arbre != null) {
            for (JsonNode noeud : arbre.path("tree")) {
                if ("blob".equals(noeud.path("type").asText())) {
                    chemins.add(noeud.path("path").asText());
                }
            }
        }
        if (chemins.isEmpty()) {
            throw new BadRequestException("Le dépôt est vide");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("ARBORESCENCE :\n");
        int lignes = 0;
        for (String chemin : chemins) {
            if (lignes >= MAX_LIGNES_ARBORESCENCE) {
                sb.append("... (liste tronquée)\n");
                break;
            }
            sb.append(chemin).append("\n");
            lignes++;
        }

        List<String> retenus = choisirFichiers(chemins);
        for (String chemin : retenus) {
            if (sb.length() >= MAX_CHARS_TOTAL) {
                break;
            }
            String contenu = lireFichier(owner, repo, chemin);
            if (contenu == null) {
                continue;
            }
            if (contenu.length() > MAX_CHARS_FICHIER) {
                contenu = contenu.substring(0, MAX_CHARS_FICHIER) + "\n... (fichier tronqué)";
            }
            sb.append("\n--- FICHIER : ").append(chemin).append(" ---\n").append(contenu).append("\n");
        }
        return sb.toString();
    }

    private List<String> choisirFichiers(List<String> chemins) {
        List<String> prioritaires = new ArrayList<>();
        List<String> autres = new ArrayList<>();
        for (String chemin : chemins) {
            if (!CHEMIN_SUR.matcher(chemin).matches() || estIgnore(chemin) || !extensionAutorisee(chemin)) {
                continue;
            }
            String nom = chemin.toLowerCase();
            if (nom.startsWith("readme") || nom.equals("pom.xml") || nom.equals("package.json")
                    || nom.equals("build.gradle") || nom.endsWith("application.yml")
                    || nom.endsWith("application.properties")) {
                prioritaires.add(chemin);
            } else {
                autres.add(chemin);
            }
        }
        List<String> resultat = new ArrayList<>(prioritaires);
        for (String chemin : autres) {
            if (resultat.size() >= MAX_FICHIERS) {
                break;
            }
            resultat.add(chemin);
        }
        if (resultat.size() > MAX_FICHIERS) {
            return resultat.subList(0, MAX_FICHIERS);
        }
        return resultat;
    }

    private boolean estIgnore(String chemin) {
        for (String motif : IGNORES) {
            if (chemin.contains(motif)) {
                return true;
            }
        }
        return false;
    }

    private boolean extensionAutorisee(String chemin) {
        String bas = chemin.toLowerCase();
        for (String ext : EXTENSIONS) {
            if (bas.endsWith(ext)) {
                return true;
            }
        }
        return false;
    }

    private String lireFichier(String owner, String repo, String chemin) {
        try {
            return client.get()
                    .uri("/repos/" + owner + "/" + repo + "/contents/" + chemin)
                    .header("Accept", "application/vnd.github.raw")
                    .retrieve()
                    .body(String.class);
        } catch (RestClientException e) {
            return null;
        }
    }
}
