import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { DomaineResponse, FormationResponse, OffreResponse } from '../../core/models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="glass-hero" style="padding-top: 5rem; padding-bottom: 5.5rem;">
      <div class="app-container" style="position: relative; z-index: 10;">
        <div style="max-width: 820px; margin: 0 auto; text-align: center;">
          
          <!-- Pill Badge -->
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; border-radius: var(--radius-full); background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(165, 180, 252, 0.3); color: var(--primary-200); font-size: 0.825rem; font-weight: 700; margin-bottom: 1.5rem; backdrop-filter: blur(8px);">
            <span>🚀</span> Plateforme Propulsée pour l'Afrique Francophone & le Togo
          </div>

          <!-- Main Title -->
          <h1 style="font-size: 2.75rem; font-weight: 800; color: #ffffff; line-height: 1.15; margin-bottom: 1.5rem; letter-spacing: -0.03em;">
            Du premier apprentissage pratique à votre <span style="background: linear-gradient(135deg, #818cf8 0%, #34d399 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">premier emploi</span>
          </h1>

          <p style="font-size: 1.15rem; color: var(--slate-300); line-height: 1.6; margin-bottom: 2.5rem; font-weight: 400;">
            Zéro QCM passif. Développez de vrais projets, faites corriger vos dépôts GitHub en quelques secondes par notre <strong>Intelligence Artificielle</strong>, décrochez un certificat infalsifiable et postulez aux offres des entreprises partenaires.
          </p>

          <!-- Action Buttons -->
          <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <a routerLink="/formations" class="btn btn-primary btn-lg" style="box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5);">
              📚 Explorer les Formations
            </a>
            <a routerLink="/orientation" class="btn btn-accent btn-lg" style="box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);">
              ✨ Diagnostic IA & Parcours
            </a>
            <a routerLink="/certificats/verify" class="btn btn-outline btn-lg" style="color: #ffffff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05);">
              🔍 Vérifier un Certificat
            </a>
          </div>

          <!-- Quick Test Accounts pill for Hackathon evaluators -->
          <div style="margin-top: 2.5rem; padding: 0.75rem 1.25rem; background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-xl); display: inline-block;">
            <span style="font-size: 0.775rem; color: var(--amber-400); font-weight: 700; text-transform: uppercase; margin-right: 0.5rem;">Comptes Démo :</span>
            <span style="font-size: 0.8rem; color: var(--slate-300); margin-right: 0.75rem;">Admin (admin&#64;felc.com)</span>
            <span style="font-size: 0.8rem; color: var(--slate-300); margin-right: 0.75rem;">Formateur (formateur&#64;felc.com)</span>
            <span style="font-size: 0.8rem; color: var(--slate-300);">Entreprise (entreprise&#64;felc.com)</span>
          </div>

        </div>
      </div>
    </section>

    <!-- Metrics Bar -->
    <section style="background: #ffffff; border-bottom: 1px solid var(--slate-200); padding: 1.75rem 0;">
      <div class="app-container">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6" style="text-align: center;">
          <div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--primary-600); font-family: var(--font-sans);">100%</div>
            <div style="font-size: 0.825rem; font-weight: 600; color: var(--slate-500); text-transform: uppercase;">Pratique par projet</div>
          </div>
          <div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--accent-600); font-family: var(--font-sans);">&lt; 15s</div>
            <div style="font-size: 0.825rem; font-weight: 600; color: var(--slate-500); text-transform: uppercase;">Correction IA GitHub</div>
          </div>
          <div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--slate-900); font-family: var(--font-sans);">FELC-ID</div>
            <div style="font-size: 0.825rem; font-weight: 600; color: var(--slate-500); text-transform: uppercase;">Certificat Vérifiable</div>
          </div>
          <div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--amber-600); font-family: var(--font-sans);">FCFA</div>
            <div style="font-size: 0.825rem; font-weight: 600; color: var(--slate-500); text-transform: uppercase;">Missions & Emploi</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Piliers FELC Section -->
    <section class="section-py" style="background-color: var(--slate-50);">
      <div class="app-container">
        <div style="text-align: center; max-width: 650px; margin: 0 auto 3.5rem auto;">
          <span class="badge badge-primary" style="margin-bottom: 0.75rem;">Méthode Différenciatrice</span>
          <h2 style="font-size: 2.15rem; margin-bottom: 1rem;">Pourquoi FELC transforme l'insertion des jeunes</h2>
          <p style="color: var(--slate-600); font-size: 1rem;">
            Nous supprimons les quiz passifs et le décalage académique pour créer une filière directe vers l'emploi.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- Pilier 1 -->
          <div class="card card-hover" style="border-top: 4px solid var(--primary-600);">
            <div class="card-body">
              <div style="width: 3.25rem; height: 3.25rem; border-radius: var(--radius-xl); background: var(--primary-50); color: var(--primary-600); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.25rem;">
                💻
              </div>
              <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem;">Apprentissage 100% Pratique</h3>
              <p style="color: var(--slate-600); font-size: 0.925rem; line-height: 1.6;">
                Chaque module se conclut par un exercice réel : développement d'une API, d'une application ou d'un projet métier avec consigne et critères explicites. Vous livrez un dépôt GitHub réel.
              </p>
            </div>
          </div>

          <!-- Pilier 2 -->
          <div class="card card-hover" style="border-top: 4px solid var(--accent-500);">
            <div class="card-body">
              <div style="width: 3.25rem; height: 3.25rem; border-radius: var(--radius-xl); background: var(--accent-50); color: var(--accent-600); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.25rem;">
                🤖
              </div>
              <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem;">IA de Correction & Orientation</h3>
              <p style="color: var(--slate-600); font-size: 0.925rem; line-height: 1.6;">
                Notre IA inspecte votre code, évalue la structure du dépôt, les commits et la conformité aux critères. Elle délivre un feedback constructif et oriente votre parcours sans hallucination.
              </p>
            </div>
          </div>

          <!-- Pilier 3 -->
          <div class="card card-hover" style="border-top: 4px solid var(--amber-500);">
            <div class="card-body">
              <div style="width: 3.25rem; height: 3.25rem; border-radius: var(--radius-xl); background: var(--amber-50); color: var(--amber-600); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.25rem;">
                🏆
              </div>
              <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem;">Certification & Emploi Direct</h3>
              <p style="color: var(--slate-600); font-size: 0.925rem; line-height: 1.6;">
                Chaque certificat génère un code infalsifiable (ex: <code>FELC-INFO-000001</code>). Un portfolio public regroupe vos projets validés et vous postulez directement aux offres des entreprises en FCFA.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Formations Récentes & Domaines -->
    <section class="section-py" style="background-color: #ffffff;">
      <div class="app-container">
        
        <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge badge-success" style="margin-bottom: 0.5rem;">Catalogue de formations</span>
            <h2 style="font-size: 2rem;">Explorez nos parcours d'excellence</h2>
          </div>
          <a routerLink="/formations" class="btn btn-outline">
            Voir tout le catalogue →
          </a>
        </div>

        <!-- Formations Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let formation of formations()" class="card card-hover">
            <div class="card-body" style="display: flex; flex-direction: column; height: 100%;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                <span class="badge badge-primary">{{ formation.domaineCode || 'TECH' }}</span>
                <span class="badge" [ngClass]="getNiveauBadgeClass(formation.niveau)">
                  {{ formation.niveau }}
                </span>
              </div>
              
              <h3 style="font-size: 1.2rem; margin-bottom: 0.6rem; color: var(--slate-900);">
                {{ formation.titre }}
              </h3>
              
              <p style="color: var(--slate-600); font-size: 0.875rem; line-height: 1.5; margin-bottom: 1.5rem; flex: 1;">
                {{ formation.description }}
              </p>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--slate-100); padding-top: 1rem; margin-top: auto;">
                <div style="font-size: 0.8rem; color: var(--slate-500);">
                  👨‍🏫 {{ formation.formateurPrenom }} {{ formation.formateurNom }}
                </div>
                <a [routerLink]="['/formations', formation.id]" class="btn btn-primary btn-sm">
                  Découvrir
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Offres Récentes Section -->
    <section class="section-py" style="background-color: var(--slate-50); border-top: 1px solid var(--slate-200);">
      <div class="app-container">
        
        <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge badge-warning" style="margin-bottom: 0.5rem;">Opportunités Actuelles</span>
            <h2 style="font-size: 2rem;">Dernières offres d'emploi & missions</h2>
          </div>
          <a routerLink="/offres" class="btn btn-outline">
            Toutes les offres ({{ offres().length }}) →
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let offre of offres().slice(0, 3)" class="card card-hover">
            <div class="card-body">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <span class="badge" [ngClass]="offre.type === 'MISSION' ? 'badge-purple' : 'badge-primary'">
                  {{ offre.type }}
                </span>
                <span *ngIf="offre.remote" class="badge badge-success">🌐 Télétravail</span>
              </div>

              <h3 style="font-size: 1.15rem; margin-bottom: 0.4rem;">
                {{ offre.titre }}
              </h3>

              <div style="font-size: 0.85rem; font-weight: 600; color: var(--primary-600); margin-bottom: 0.75rem;">
                🏢 {{ offre.entrepriseNom }} • 📍 {{ offre.localisation }}
              </div>

              <p style="font-size: 0.875rem; color: var(--slate-600); line-height: 1.5; margin-bottom: 1.25rem;">
                {{ offre.description.slice(0, 110) }}...
              </p>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--slate-100); padding-top: 0.85rem;">
                <div style="font-weight: 800; color: var(--slate-900); font-size: 0.95rem;">
                  {{ offre.budget | number }} FCFA
                </div>
                <a [routerLink]="['/offres', offre.id]" class="btn btn-primary btn-sm">
                  Postuler
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Call to action Banner -->
    <section style="background: linear-gradient(135deg, var(--primary-700), var(--primary-900)); color: white; padding: 4.5rem 0; text-align: center;">
      <div class="app-container" style="max-width: 700px;">
        <h2 style="font-size: 2.25rem; color: #ffffff; margin-bottom: 1rem;">
          Prêt à bâtir votre avenir professionnel ?
        </h2>
        <p style="font-size: 1.1rem; color: var(--primary-200); margin-bottom: 2rem;">
          Rejoignez dès aujourd'hui la communauté FELC, testez vos compétences avec l'IA et accédez aux meilleures opportunités de carrière.
        </p>
        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <a routerLink="/auth/register" class="btn btn-accent btn-lg">
            Créer un compte gratuit
          </a>
          <a routerLink="/orientation" class="btn btn-outline btn-lg" style="color: white; border-color: rgba(255,255,255,0.4);">
            Lancer le diagnostic IA
          </a>
        </div>
      </div>
    </section>
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
