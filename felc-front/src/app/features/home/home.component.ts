import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { FormationResponse, OffreResponse } from '../../core/models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="position: relative; overflow: hidden;">
      
      <!-- Ambient Background Glows -->
      <div class="ambient-glow-top"></div>

      <!-- Hero Section -->
      <section style="padding-top: 5rem; padding-bottom: 5.5rem; position: relative; z-index: 2;">
        <div class="app-container">
          
          <div style="max-width: 900px; margin: 0 auto; text-align: center;">
            
            <!-- Futuristic Badge -->
            <div style="display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.45rem 1.25rem; border-radius: var(--radius-full); background: rgba(99, 102, 241, 0.12); border: 1px solid rgba(99, 102, 241, 0.35); color: #c7d2fe; font-size: 0.85rem; font-weight: 700; font-family: var(--font-display); letter-spacing: 0.04em; margin-bottom: 2rem; backdrop-filter: blur(12px); box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);">
              <span class="pulsing-dot"></span>
              <span>PLATEFORME EDTECH & IA D'INSERTION PROFESSIONNELLE</span>
            </div>

            <!-- Main Title with Cyber Gradient -->
            <h1 style="font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -0.04em;">
              Du premier projet au <br>
              <span style="background: var(--grad-cyber); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 30px rgba(99, 102, 241, 0.3);">
                premier contrat rémunéré.
              </span>
            </h1>

            <p style="font-size: 1.2rem; color: #94a3b8; line-height: 1.6; margin-bottom: 2.75rem; max-width: 760px; margin-left: auto; margin-right: auto; font-weight: 400;">
              Oubliez les QCM théoriques passifs. Développez des projets concrets, faites évaluer vos dépôts GitHub en <strong>temps réel par l'IA Claude</strong>, décrochez un certificat infalsifiable et postulez aux opportunités des entreprises en FCFA.
            </p>

            <!-- Action Buttons -->
            <div style="display: flex; align-items: center; justify-content: center; gap: 1.25rem; flex-wrap: wrap;">
              <a routerLink="/orientation" class="btn btn-cyber btn-lg" style="box-shadow: 0 0 35px rgba(6, 182, 212, 0.5);">
                ✨ Lancer le Diagnostic IA
              </a>
              <a routerLink="/formations" class="btn btn-outline btn-lg">
                📚 Formations Pratiques
              </a>
              <a routerLink="/impact" class="btn btn-outline btn-lg" style="border-color: rgba(16, 185, 129, 0.4); color: #6ee7b7;">
                🌍 Impact Humanitaire ODD
              </a>
              <a routerLink="/certificats/verify" class="btn btn-outline btn-lg" style="border-color: rgba(245, 158, 11, 0.4); color: #fde68a;">
                🛡️ Vérifier un Certificat
              </a>
            </div>

            <!-- Demo Accounts Pill for Hackathon Evaluators -->
            <div style="margin-top: 2.5rem; padding: 0.85rem 1.5rem; background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-xl); display: inline-flex; align-items: center; gap: 1rem; flex-wrap: wrap; backdrop-filter: blur(16px);">
              <span style="font-size: 0.775rem; color: var(--neon-amber); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
                ⚡ Comptes Démo Hackathon :
              </span>
              <span style="font-size: 0.825rem; color: #cbd5e1;">👑 Admin (admin&#64;felc.com)</span>
              <span style="font-size: 0.825rem; color: #cbd5e1;">👨‍🏫 Formateur (formateur&#64;felc.com)</span>
              <span style="font-size: 0.825rem; color: #cbd5e1;">🏢 Entreprise (entreprise&#64;felc.com)</span>
              <span style="font-size: 0.825rem; color: #cbd5e1;">🎓 Apprenant (apprenant&#64;felc.com)</span>
            </div>

          </div>

          <!-- Cyber Terminal Mockup: Live AI Code Review Preview -->
          <div style="max-width: 920px; margin: 4.5rem auto 0 auto;">
            <div class="terminal-window">
              <div class="terminal-header">
                <span class="terminal-dot dot-red"></span>
                <span class="terminal-dot dot-yellow"></span>
                <span class="terminal-dot dot-green"></span>
                <span style="margin-left: 0.75rem; color: #94a3b8; font-size: 0.75rem;">felc-ai-engine &#64; claude-sonnet-5-5 — bash — 80x24</span>
              </div>
              <div class="terminal-body">
                <div style="color: #94a3b8;"><span style="color: #38bdf8;">felc-eval</span> --github https://github.com/apprenant-felc/spring-ecommerce --criteria STRICT</div>
                <div style="color: #a855f7; margin-top: 0.4rem;">[AI-ORCHESTRATOR] ⚡ Initializing Anthropic Claude 3.5 Sonnet model... Connected.</div>
                <div style="color: #06b6d4;">[GIT-INSPECTOR]  📁 Clonage virtuel : 18 fichiers Java, README.md, pom.xml détectés.</div>
                <div style="color: #10b981;">[STATIC-ANALYSIS] ✔ Architecture Hexagonale respectée | Sécurité JWT sans état confirmée.</div>
                <div style="color: #e2e8f0; margin-top: 0.4rem; padding-left: 1rem; border-left: 2px solid #10b981;">
                  <strong style="color: #34d399;">NOTE ATTRIBUÉE : 94 / 100</strong><br>
                  <span style="color: #cbd5e1;">"Excellente gestion des exceptions avec GlobalExceptionHandler et tests d'intégration complets. Critères validés."</span>
                </div>
                <div style="color: #facc15; margin-top: 0.5rem; font-weight: 700;">
                  🏆 STATUT: VALIDÉE ➔ Certificat émis : FELC-INFO-000042 (Vérifiable publiquement)
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Key Metrics Hologram Bar -->
      <section style="background: rgba(15, 23, 42, 0.6); border-top: 1px solid rgba(255, 255, 255, 0.08); border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding: 2.25rem 0; backdrop-filter: blur(16px);">
        <div class="app-container">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6" style="text-align: center;">
            <div>
              <div style="font-size: 2.5rem; font-weight: 800; font-family: var(--font-display); background: var(--grad-cyber); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">100%</div>
              <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Pratique par projet réel</div>
            </div>
            <div>
              <div style="font-size: 2.5rem; font-weight: 800; font-family: var(--font-display); color: #34d399; text-shadow: 0 0 20px rgba(52, 211, 153, 0.4);">&lt; 15s</div>
              <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Correction IA Claude</div>
            </div>
            <div>
              <div style="font-size: 2.5rem; font-weight: 800; font-family: var(--font-display); color: #facc15; text-shadow: 0 0 20px rgba(250, 204, 21, 0.4);">FELC-ID</div>
              <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Certificat Infalsifiable</div>
            </div>
            <div>
              <div style="font-size: 2.5rem; font-weight: 800; font-family: var(--font-display); color: #a855f7; text-shadow: 0 0 20px rgba(168, 85, 247, 0.4);">FCFA</div>
              <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Rémunération Immédiate</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3 Piliers Technologiques -->
      <section class="section-py">
        <div class="app-container">
          
          <div style="text-align: center; max-width: 700px; margin: 0 auto 4rem auto;">
            <span class="badge badge-cyber" style="margin-bottom: 0.85rem;">Architecture Révolutionnaire</span>
            <h2 style="font-size: 2.5rem; margin-bottom: 1rem; color: #ffffff;">
              Comment FELC élimine la fracture de l'emploi
            </h2>
            <p style="color: #94a3b8; font-size: 1.05rem;">
              En combinant IA générative, évaluation de code source et certification vérifiable, nous créons un pont direct entre formation et entreprises.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <!-- Pilier 1 -->
            <div class="card card-hover" style="border-top: 3px solid var(--neon-cyan);">
              <div class="card-body">
                <div style="width: 3.5rem; height: 3.5rem; border-radius: var(--radius-xl); background: rgba(6, 182, 212, 0.15); color: var(--neon-cyan); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.5rem; box-shadow: 0 0 20px rgba(6, 182, 212, 0.25);">
                  💻
                </div>
                <h3 style="font-size: 1.35rem; margin-bottom: 0.75rem; color: #ffffff;">100% Pratique & Code Source</h3>
                <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6;">
                  Pas de quiz passifs à choix multiples. Chaque apprenant développe et déploie de véritables applications, soumet des dépôts GitHub publics et apprend les standards de l'industrie.
                </p>
              </div>
            </div>

            <!-- Pilier 2 -->
            <div class="card card-hover" style="border-top: 3px solid var(--neon-indigo);">
              <div class="card-body">
                <div style="width: 3.5rem; height: 3.5rem; border-radius: var(--radius-xl); background: rgba(99, 102, 241, 0.15); color: var(--neon-indigo); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.5rem; box-shadow: 0 0 20px rgba(99, 102, 241, 0.25);">
                  🤖
                </div>
                <h3 style="font-size: 1.35rem; margin-bottom: 0.75rem; color: #ffffff;">Moteurs IA Haute Précision</h3>
                <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6;">
                  L'IA corrige automatiquement les exercices de code en quelques secondes et génère un parcours d'orientation sur-mesure <strong>strictement filtré anti-hallucination</strong> sur le catalogue réel.
                </p>
              </div>
            </div>

            <!-- Pilier 3 -->
            <div class="card card-hover" style="border-top: 3px solid var(--neon-amber);">
              <div class="card-body">
                <div style="width: 3.5rem; height: 3.5rem; border-radius: var(--radius-xl); background: rgba(245, 158, 11, 0.15); color: var(--neon-amber); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.5rem; box-shadow: 0 0 20px rgba(245, 158, 11, 0.25);">
                  🛡️
                </div>
                <h3 style="font-size: 1.35rem; margin-bottom: 0.75rem; color: #ffffff;">Certification & Emploi Direct</h3>
                <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6;">
                  Chaque certificat est unique et vérifiable sans compte par les recruteurs. Un portfolio public regroupe les projets validés et connecte les talents aux offres d'entreprises en FCFA.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- Formations Phares Grid -->
      <section class="section-py" style="background: rgba(11, 17, 32, 0.4); border-top: 1px solid rgba(255, 255, 255, 0.06);">
        <div class="app-container">
          
          <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 3rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge badge-primary" style="margin-bottom: 0.5rem;">Catalogue d'Excellence</span>
              <h2 style="font-size: 2.25rem; color: #ffffff;">Formations Pratiques Certifiantes</h2>
            </div>
            <a routerLink="/formations" class="btn btn-outline">
              Voir tout le catalogue →
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div *ngFor="let formation of formations()" class="card card-hover">
              <div class="card-body" style="display: flex; flex-direction: column; height: 100%;">
                
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
                  <span class="badge badge-primary">{{ formation.domaineCode || 'TECH' }}</span>
                  <span class="badge" [ngClass]="getNiveauBadgeClass(formation.niveau)">
                    {{ formation.niveau }}
                  </span>
                </div>
                
                <h3 style="font-size: 1.3rem; margin-bottom: 0.75rem; color: #ffffff;">
                  {{ formation.titre }}
                </h3>
                
                <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem; flex: 1;">
                  {{ formation.description }}
                </p>

                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1.25rem; margin-top: auto;">
                  <div style="font-size: 0.8rem; color: #64748b;">
                    👨‍🏫 {{ formation.formateurPrenom }} {{ formation.formateurNom }}
                  </div>
                  <a [routerLink]="['/formations', formation.id]" class="btn btn-primary btn-sm">
                    Rejoindre →
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Offres d'Emploi Récentes -->
      <section class="section-py">
        <div class="app-container">
          
          <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 3rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge badge-warning" style="margin-bottom: 0.5rem;">Marché Professionnel</span>
              <h2 style="font-size: 2.25rem; color: #ffffff;">Dernières Offres d'Emploi & Missions</h2>
            </div>
            <a routerLink="/offres" class="btn btn-outline">
              Toutes les opportunités ({{ offres().length }}) →
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div *ngFor="let offre of offres().slice(0, 3)" class="card card-hover">
              <div class="card-body">
                
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                  <span class="badge" [ngClass]="offre.type === 'MISSION' ? 'badge-purple' : 'badge-primary'">
                    {{ offre.type }}
                  </span>
                  <span *ngIf="offre.remote" class="badge badge-success">🌐 Remote</span>
                </div>

                <h3 style="font-size: 1.25rem; margin-bottom: 0.4rem; color: #ffffff;">
                  {{ offre.titre }}
                </h3>

                <div style="font-size: 0.875rem; font-weight: 600; color: var(--neon-cyan); margin-bottom: 1rem;">
                  🏢 {{ offre.entrepriseNom }} • 📍 {{ offre.localisation }}
                </div>

                <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.6; margin-bottom: 1.5rem;">
                  {{ offre.description.slice(0, 115) }}...
                </p>

                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1rem;">
                  <div>
                    <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Budget / Salaire</div>
                    <div style="font-weight: 800; color: #ffffff; font-size: 1.15rem; font-family: var(--font-display);">
                      {{ offre.budget | number }} FCFA
                    </div>
                  </div>
                  <a [routerLink]="['/offres', offre.id]" class="btn btn-cyber btn-sm">
                    Postuler
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Humanitarian Impact & UN SDGs Banner -->
      <section style="background: rgba(6, 182, 212, 0.04); border-top: 1px solid rgba(6, 182, 212, 0.15); border-bottom: 1px solid rgba(6, 182, 212, 0.15); padding: 4.5rem 0;">
        <div class="app-container">
          <div style="text-align: center; max-width: 760px; margin: 0 auto 3.5rem;">
            <span class="badge badge-cyber" style="margin-bottom: 0.75rem;">Impact Sociétal & Humanitaire</span>
            <h2 style="font-size: 2.35rem; color: #ffffff; margin-bottom: 1rem;">
              Candidat au Prix de l'Impact Numérique Durable
            </h2>
            <p style="color: #cbd5e1; font-size: 1.05rem; line-height: 1.6;">
              FELC est alignée sur 5 Objectifs de Développement Durable (ODD 1, 4, 5, 8, 13) pour transformer la formation en émancipation économique réelle.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6" style="margin-bottom: 3rem;">
            
            <div class="card card-glow-emerald">
              <div class="card-body">
                <div style="font-size: 2rem; margin-bottom: 0.75rem;">🌍</div>
                <h3 style="font-size: 1.2rem; color: #ffffff; margin-bottom: 0.5rem;">Inclusion & 5 Régions du Togo</h3>
                <p style="color: #94a3b8; font-size: 0.88rem; line-height: 1.6;">
                  42% des apprenants formés sont hors de la capitale (Kara, Sokodé, Kpalimé, Dapaong) grâce au Mode Frugal 2G/3G et à l'assistant vocal.
                </p>
              </div>
            </div>

            <div class="card card-glow-amber">
              <div class="card-body">
                <div style="font-size: 2rem; margin-bottom: 0.75rem;">🤝</div>
                <h3 style="font-size: 1.2rem; color: #ffffff; margin-bottom: 0.5rem;">Bourses Tremplin & Diaspora</h3>
                <p style="color: #94a3b8; font-size: 0.88rem; line-height: 1.6;">
                  Financement direct de pass 4G (5 000 FCFA) et de PC portables reconditionnés pour les étudiants ayant validé leurs premiers exercices.
                </p>
              </div>
            </div>

            <div class="card card-glow-cyan">
              <div class="card-body">
                <div style="font-size: 2rem; margin-bottom: 0.75rem;">👩‍💻</div>
                <h3 style="font-size: 1.2rem; color: #ffffff; margin-bottom: 0.5rem;">Femmes & Tech Togo</h3>
                <p style="color: #94a3b8; font-size: 0.88rem; line-height: 1.6;">
                  Programme d'encouragement actif pour atteindre 50% de femmes certifiées dans le développement web, l'IoT et les énergies renouvelables.
                </p>
              </div>
            </div>

          </div>

          <div style="text-align: center; display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <a routerLink="/impact" class="btn btn-cyber">
              Découvrir le Rapport d'Impact ODD ➔
            </a>
            <a routerLink="/bourses" class="btn btn-outline" style="border-color: rgba(245, 158, 11, 0.5); color: #fde68a;">
              🤝 Parrainer une Bourse 4G
            </a>
          </div>
        </div>
      </section>

      <!-- Futuristic Call To Action -->
      <section style="padding: 5rem 0; position: relative; border-top: 1px solid rgba(255, 255, 255, 0.08); background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 70%);">
        <div class="app-container" style="max-width: 750px; text-align: center;">
          <h2 style="font-size: 2.75rem; color: #ffffff; margin-bottom: 1.25rem;">
            Prêt à propulser votre carrière avec l'IA ?
          </h2>
          <p style="font-size: 1.15rem; color: #94a3b8; margin-bottom: 2.5rem; line-height: 1.6;">
            Créez votre compte gratuit, testez vos compétences et rejoignez la nouvelle génération de talents d'Afrique francophone.
          </p>
          <div style="display: flex; justify-content: center; gap: 1.25rem; flex-wrap: wrap;">
            <a routerLink="/auth/register" class="btn btn-cyber btn-lg">
              Rejoindre FELC Gratuitement ⚡
            </a>
            <a routerLink="/orientation" class="btn btn-outline btn-lg">
              Diagnostic d'Orientation IA
            </a>
          </div>
        </div>
      </section>

    </div>
  `
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService);

  public formations = signal<FormationResponse[]>([]);
  public offres = signal<OffreResponse[]>([]);

  ngOnInit() {
    this.api.getFormations().subscribe({
      next: data => this.formations.set(data),
      error: () => {}
    });

    this.api.getOffres().subscribe({
      next: data => this.offres.set(data),
      error: () => {}
    });
  }

  getNiveauBadgeClass(niveau: string): string {
    switch (niveau) {
      case 'DEBUTANT': return 'badge-success';
      case 'INTERMEDIAIRE': return 'badge-primary';
      case 'AVANCE': return 'badge-warning';
      default: return 'badge-slate';
    }
  }
}
