# FELC — Formation et Emploi en Ligne et en Communauté

> **Plateforme web tout-en-un qui accompagne un jeune francophone du premier apprentissage jusqu'à sa première opportunité professionnelle : formation pratique, mentorat & forum communautaire, certification vérifiable, et emploi / freelance.**
> Lancée initialement au Togo, avec une vision d'extension à toute l'Afrique francophone. FELC n'est pas limitée au numérique : n'importe quel domaine peut y être intégré (agriculture, marketing, artisanat, finance...).

---

## 1. Présentation

### Le problème visé
Les jeunes diplômés et autodidactes manquent souvent d'orientation claire sur les compétences demandées par le marché, n'ont pas d'expérience concrète à valoriser dans leur CV, et souffrent du décalage entre les formations théoriques et les besoins réels des recruteurs.

### Ce qui différencie FELC
- **Des formations 100 % pratiques** : Pas de quiz théoriques passifs. Chaque formation est une suite d'exercices pratiques avec des critères d'évaluation précis et un projet final. L'apprenant soumet des livrables concrets (dépôt GitHub, lien cloud, etc.).
- **L'Intelligence Artificielle à deux niveaux stratégiques** :
  1. **Correction automatique de code** : Analyse directe du dépôt GitHub par l'IA (structure, code, build, conformité aux critères) avec feedback constructif et attribution d'une note.
  2. **Orientation personnalisée anti-hallucination** : Recommandation d'un parcours sur-mesure ancré rigoureusement sur le catalogue réel de la plateforme et les offres du marché.
- **Une certification vérifiable publiquement** : Chaque certificat porte un identifiant unique (ex: `FELC-INFO-000001`) vérifiable sans compte par n'importe quel recruteur.
- **Un portfolio automatique** : Agrégation dynamique des compétences validées, projets concrets et certificats obtenus dans un lien unique partageable (`/api/portfolio/{id}`).
- **Forum communautaire & entraide** : Espace d'échange entre apprenants et experts/formateurs, avec possibilité de marquer les solutions validées.
- **Le lien direct avec l'emploi** : Publication d'offres (CDI, CDD, stages, missions freelance) par des entreprises et suivi des candidatures de bout en bout.

---

## 2. Les rôles utilisateurs

| Rôle | Description & Prérogatives |
| :--- | :--- |
| **`APPRENANT`** | Se forme, soumet ses exercices (liens GitHub), reçoit l'évaluation IA ou formateur, obtient des certificats, échange sur le forum, postule aux offres et partage son portfolio public. |
| **`FORMATEUR`** | Crée et gère ses formations, modules et exercices pratiques, évalue manuellement les soumissions et apporte du mentorat sur le forum. |
| **`ENTREPRISE`** | Profil d'entreprise configuré à l'inscription, publie des offres d'emploi ou des missions freelance (en FCFA), consulte et traite les candidatures reçues. |
| **`ADMIN`** | Gestionnaire de la plateforme : crée les domaines, analyse les statistiques globales, modère les offres, active/désactive des comptes et supervise les contenus. |

> *Note* : Le rôle `ADMIN` ne peut pas être obtenu par auto-inscription. Il est initialisé au démarrage de l'application via les variables d'environnement (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).

---

## 3. Parcours utilisateurs

```
   [ Apprenant ]
        │
        ├─► Inscription & Profil (compétences)
        ├─► Questionnaire d'Orientation IA ──► Parcours personnalisé + Opportunités réelles
        ├─► Inscription à une formation pratique
        ├─► Réalisation d'exercices & Soumission de lien GitHub
        │        │
        │        ├─► Correction IA immédiate (note ≥ 70 = VALIDÉE, sinon À REVOIR)
        │        └─► Ou correction manuelle par le Formateur
        ├─► Progression automatique ──► Génération du Certificat unique FELC
        ├─► Échanges sur le Forum (entraide, questions, solutions)
        ├─► Activation du Portfolio public
        └─► Candidature directe aux Offres d'emploi & missions des Entreprises
```

---

## 4. Architecture technique

```
       Angular Frontend (localhost:4200)
              │  JSON REST + Bearer JWT
              ▼
    Spring Boot Backend (/api/...)  [Java 21 / Spring Boot 4]
     ├── PostgreSQL (Supabase)        ── Stockage persistant
     ├── Anthropic Claude API         ── Correction de code & Orientation IA
     └── GitHub REST API              ── Inspection des dépôts de code
```

### Organisation du Backend (`com.felc`)

| Package | Rôle |
| :--- | :--- |
| **`entity`** | Entités JPA mappées vers PostgreSQL (`User`, `Formation`, `Exercice`, `Certificat`, `Offre`, etc.). |
| **`enums`** | Énumérations fixes (`Role`, `Niveau`, `TypeOffre`, `StatutOffre`, `StatutCandidature`, etc.). |
| **`repository`** | Repositories Spring Data JPA avec requêtes dérivées et optimisées. |
| **`dto.request` / `response`**| Objets de transfert immutables (Java Records) avec validation Jakarta (`@NotBlank`, `@Size`, etc.). |
| **`mapper`** | Conversion Entités ↔ DTOs avec résolution explicite des clés étrangères. |
| **`service`** | Logique métier transactionnelle (`@Transactional`), contrôles de propriété et règles d'accès. |
| **`controller`** | Points de terminaison REST sécurisés avec `@PreAuthorize` et validation `@Valid`. |
| **`security`** | Filtre JWT sans état, `CustomUserDetailsService` et configuration Spring Security. |
| **`config`** | Initialiseurs de démo (`DemoDataLoader`, `DemoEmploiLoader`, `DemoForumLoader`, `AdminInitializer`). |
| **`exception`** | Exceptions métier personnalisées et `GlobalExceptionHandler` unifié. |

---

## 5. Modèle de données relationnel

```
 ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
 │   Domaines    │◄───────│  Formations   │───────►│     User      │ (Formateur)
 └───────┬───────┘        └───────┬───────┘        └───────┬───────┘
         │                        │                        │
         │                ┌───────┴───────┐        ┌───────┴───────┐
         │                │    Modules    │        │ Inscriptions  │
         │                ├───────────────┤        ├───────────────┤
         │                │   Exercices   │        │  Certificats  │
         │                └───────┬───────┘        ├───────────────┤
         │                        │                │ Candidatures  │
         │                ┌───────┴───────┐        └───────────────┘
         │                │  Soumissions  │
         │                └───────────────┘
         ▼                                                 ▲
 ┌───────────────┐        ┌───────────────┐                │
 │    Offres     │◄───────│  Entreprises  │────────────────┘ (1-1 User)
 └───────────────┘        └───────────────┘
         ▲
         │
 ┌───────┴───────┐        ┌───────────────┐
 │ Sujets_Forum  │◄───────│Messages_Forum │
 └───────────────┘        └───────────────┘
```

---

## 6. Sécurité

- **Authentification sans état (Stateless JWT)** : Token HMAC-SHA256 transmis via le header `Authorization: Bearer <token>`.
- **Mots de passe hachés** avec BCrypt.
- **Contrôle d'accès à double niveau** :
  1. *Niveau Route* : `@PreAuthorize("hasRole('FORMATEUR')")` pour les droits globaux.
  2. *Niveau Métier* : `AccessService` vérifie la stricte propriété de la ressource (un formateur ne modifie que ses formations, un apprenant ses soumissions, etc.). L'administrateur a un droit de regard global.
- **Règles de confidentialité** :
  - Un portfolio privé renvoie une erreur 404 (pour ne pas révéler son existence).
  - Un compte désactivé par l'administrateur reçoit immédiatement un 403 Forbidden.
  - Le contenu des dépôts GitHub soumis est analysé comme du texte non fiable dans les prompts IA (protection contre le prompt injection).

---

## 7. Les Moteurs d'Intelligence Artificielle

### 1. Correction automatique de soumissions
- **Fonctionnement** : Le backend inspecte le dépôt GitHub public soumis par l'apprenant via l'API GitHub (arborescence, README, configurations Maven/Node, et fichiers sources clés).
- **Évaluation Claude** : L'IA reçoit la consigne de l'exercice, les critères d'évaluation et le code extrait. Elle génère une note (0 à 100) et un feedback structuré.
- **Prise de décision souveraine** :
  - **Note ≥ 70** : La soumission passe à `VALIDEE`, la progression de la formation est mise à jour. Si tous les exercices sont validés, le certificat `FELC-XXX-YYY` est émis automatiquement.
  - **Note < 70** : La soumission passe à `A_REVOIR`. L'apprenant peut corriger et resoumettre son code.

### 2. Orientation intelligente (Anti-Hallucination)
- L'apprenant décrit son profil, son niveau, ses objectifs et ses disponibilités.
- L'IA reçoit ces données ainsi que le **catalogue réel** des formations disponibles.
- **Garantie anti-hallucination** : Le backend filtre la réponse de l'IA pour ne retenir que les identifiants de formations qui existent véritablement en base de données. Les opportunités professionnelles (offres d'emploi associées au domaine) sont injectées directement par le backend.

---

## 8. Configuration et Lancement

### Variables d'environnement (`.env`)

Copiez le fichier `.env.example` en `.env` et adaptez les valeurs :

```bash
# Base de données PostgreSQL (ex: Supabase)
export DB_URL="jdbc:postgresql://db.newfxattfntwtuwypwvk.supabase.co:5432/postgres?sslmode=require"
export DB_USER="postgres"
export DB_PASSWORD="votre_mot_de_passe"

# Sécurité JWT (minimum 32 caractères)
export JWT_SECRET="felc-hackathon-2026-super-secret-key-jwt-security-minimum-32-chars"

# Compte administrateur initial
export ADMIN_EMAIL="admin@felc.com"
export ADMIN_PASSWORD="adminpassword123"

# Profil Spring
export SPRING_PROFILES_ACTIVE="dev"

# Clés API IA et GitHub
export ANTHROPIC_API_KEY="sk-ant-api..."
export GITHUB_TOKEN="ghp_..."
```

### Lancement du Backend

```bash
# Chargement des variables d'environnement
source .env

# Compilation et exécution
./mvnw clean spring-boot:run
```

Le serveur démarre sur `http://localhost:8080`.

### Comptes de démonstration pré-chargés (profil dev) :
- **Admin** : `admin@felc.com` / `adminpassword123`
- **Formateur** : `formateur@felc.com` / `formateur123`
- **Entreprise** : `entreprise@felc.com` / `entreprise123`
- **Apprenant** : `apprenant@felc.com` / `apprenant123`

---

## 9. Répertoire des Endpoints REST

| Domaine | Méthode | Route | Rôle requis |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Public |
| | `POST` | `/api/auth/login` | Public |
| **Profil** | `GET`, `PUT`| `/api/users/me` | Authentifié |
| | `POST`, `DELETE`| `/api/users/me/competences` | `APPRENANT` |
| **Domaines** | `GET` | `/api/domaines` | Public |
| | `POST` | `/api/domaines` | `ADMIN` |
| **Formations** | `GET` | `/api/formations` | Public |
| | `GET` | `/api/formations/{id}` | Public |
| | `POST` | `/api/formations` | `FORMATEUR`, `ADMIN` |
| **Modules & Exercices**| `POST` | `/api/formations/{id}/modules` | Propriétaire / `ADMIN` |
| | `POST` | `/api/formations/{id}/exercices`| Propriétaire / `ADMIN` |
| **Inscriptions** | `POST` | `/api/formations/{id}/inscription` | `APPRENANT` |
| | `GET` | `/api/inscriptions/me` | `APPRENANT` |
| **Soumissions** | `POST` | `/api/exercices/{id}/soumissions` | `APPRENANT` |
| | `POST` | `/api/soumissions/{id}/correction-ia` | `APPRENANT` |
| | `PUT` | `/api/soumissions/{id}/evaluation` | `FORMATEUR`, `ADMIN` |
| **Certificats** | `GET` | `/api/certificats/me` | `APPRENANT` |
| | `GET` | `/api/certificats/verify/{code}` | Public |
| **Offres** | `GET` | `/api/offres` | Public |
| | `POST` | `/api/offres` | `ENTREPRISE` |
| | `PUT` | `/api/offres/{id}/statut` | `ENTREPRISE`, `ADMIN` |
| **Candidatures** | `POST` | `/api/offres/{id}/candidatures` | `APPRENANT` |
| | `GET` | `/api/candidatures/me` | `APPRENANT` |
| | `PUT` | `/api/candidatures/{id}/statut` | `ENTREPRISE` |
| **Orientation IA** | `POST` | `/api/orientation` | `APPRENANT` |
| **Portfolio** | `GET` | `/api/portfolio/{id}` | Public (si actif) |
| | `PUT` | `/api/portfolio/me/visibilite` | `APPRENANT` |
| **Forum** | `GET`, `POST`| `/api/forum/sujets` | Authentifié / Public (GET) |
| | `POST` | `/api/forum/sujets/{id}/messages` | Authentifié |
| | `PUT` | `/api/forum/messages/{id}/solution`| Auteur du sujet / `ADMIN` |
| **Administration** | `GET` | `/api/admin/stats` | `ADMIN` |
| | `GET` | `/api/admin/users` | `ADMIN` |
| | `PUT` | `/api/admin/users/{id}/activation` | `ADMIN` |

---

## 10. Guide du Frontend Angular (Phase 9)

### Structure recommandée
```
frontend/src/app/
├── core/
│   ├── interceptors/    # jwt.interceptor.ts, error.interceptor.ts
│   ├── guards/          # auth.guard.ts, role.guard.ts
│   └── services/        # auth.service.ts, api.service.ts
├── shared/
│   ├── models/          # interfaces TypeScript calquées sur les DTOs
│   └── components/      # navbar, footer, alert, modal
└── features/
    ├── auth/            # login, register
    ├── orientation/     # questionnaire IA & restitution parcours
    ├── formations/      # catalogue, détail, apprentissage
    ├── exercices/       # soumission dépôt, bouton correction IA, feedback
    ├── certificats/     # mes certificats, page publique de vérification
    ├── offres/          # liste offres, détail, postuler, gestion recruteur
    ├── forum/           # liste sujets, fil de discussion, marquer solution
    ├── portfolio/       # vue publique & paramétrage visibilité
    └── admin/           # dashboard statistiques, modération utilisateurs & offres
```

---

## 11. Scénario de Démonstration (Hackathon)

1. **Orientation IA** : L'apprenant répond à quelques questions ciblées ; l'IA lui suggère un parcours réel adapté au marché togolais/francophone.
2. **Apprentissage pratique** : Inscription à la formation, consultation des modules et consigne du premier exercice.
3. **Correction automatique par IA** : Soumission d'un dépôt GitHub public. L'IA inspecte le code et attribue un feedback précis et une note en temps réel.
4. **Certification & Preuve vérifiable** : Dès validation des exercices, le certificat `FELC-XXX-YYY` est délivré. Test de la page publique de vérification sans authentification.
5. **Portfolio & Insertion professionnelle** : Le portfolio public est généré automatiquement. L'apprenant postule en un clic à une offre d'emploi ou mission freelance adaptée.
6. **Entraide communautaire** : Démonstration du forum avec résolution de question par un expert/formateur.
