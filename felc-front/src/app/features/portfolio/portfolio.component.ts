import { Component, OnInit, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { PortfolioResponse } from '../../core/models/models';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="section-py" style="background: linear-gradient(135deg, var(--slate-100), var(--primary-50)); min-height: 85vh;">
      <div class="app-container" style="max-width: 950px;">
        
        <!-- Toggle Bar for Owner -->
        <div *ngIf="isOwner" class="card" style="margin-bottom: 2rem; border-left: 5px solid var(--accent-500);">
          <div class="card-body" style="padding: 1.25rem 1.75rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <strong style="color: var(--slate-900); font-size: 1.05rem;">Visibilité de votre Portfolio Public</strong>
              <p style="color: var(--slate-600); font-size: 0.85rem; margin: 0;">
                Permettez aux recruteurs et entreprises de consulter vos compétences et projets validés sans mot de passe.
              </p>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span class="badge" [ngClass]="portfolioPublic() ? 'badge-success' : 'badge-slate'">
                {{ portfolioPublic() ? 'EN LIGNE (PUBLIC)' : 'PRIVÉ' }}
              </span>
              <button 
                (click)="toggleVisibilite()" 
                class="btn btn-sm"
                [ngClass]="portfolioPublic() ? 'btn-outline' : 'btn-accent'"
              >
                {{ portfolioPublic() ? 'Rendre Privé' : 'Activer Publiquement' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Portfolio Content Card -->
        <div *ngIf="portfolio(); else loadingTpl" class="card" style="box-shadow: var(--shadow-xl); overflow: hidden;">
          
          <!-- Cover Banner -->
          <div style="height: 140px; background: linear-gradient(135deg, var(--primary-700), var(--primary-900)); position: relative;">
            <div style="position: absolute; bottom: -35px; left: 2rem; width: 75px; height: 75px; border-radius: 50%; background: #ffffff; border: 4px solid #ffffff; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; color: var(--primary-700); box-shadow: var(--shadow-md);">
              {{ portfolio()?.prenom?.charAt(0) }}{{ portfolio()?.nom?.charAt(0) }}
            </div>
          </div>

          <div class="card-body" style="padding: 3rem 2.25rem 2.25rem 2.25rem;">
            
            <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <h1 style="font-size: 2.15rem; color: var(--slate-900); margin-bottom: 0.25rem;">
                  {{ portfolio()?.prenom }} {{ portfolio()?.nom }}
                </h1>
                <div style="font-size: 0.95rem; color: var(--slate-600); display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                  <span *ngIf="portfolio()?.localisation">📍 {{ portfolio()?.localisation }}</span>
                  <span class="badge badge-success">Profil Validé FELC</span>
                </div>
              </div>

              <!-- Social Links -->
              <div style="display: flex; gap: 0.5rem;">
                <a *ngIf="portfolio()?.lienGithub" [href]="portfolio()?.lienGithub" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                  GitHub ↗
                </a>
                <a *ngIf="portfolio()?.lienLinkedin" [href]="portfolio()?.lienLinkedin" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                  LinkedIn ↗
                </a>
              </div>
            </div>

            <!-- Bio -->
            <p *ngIf="portfolio()?.bio" style="font-size: 1.05rem; color: var(--slate-700); line-height: 1.6; margin-bottom: 2rem; border-left: 3px solid var(--primary-500); padding-left: 1rem;">
              {{ portfolio()?.bio }}
            </p>

            <!-- Compétences Maîtrisées -->
            <div style="margin-bottom: 2.5rem;" *ngIf="portfolio()?.competences?.length">
              <h3 style="font-size: 1.2rem; margin-bottom: 0.85rem; color: var(--slate-900);">
                🛠️ Compétences Pratiques Certifiées
              </h3>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                <span *ngFor="let comp of portfolio()?.competences" class="badge badge-primary" style="font-size: 0.85rem; padding: 0.4rem 0.75rem;">
                  {{ comp }}
                </span>
              </div>
            </div>

            <!-- Projets Pratiques Validés -->
            <div style="margin-bottom: 2.5rem;">
              <h3 style="font-size: 1.2rem; margin-bottom: 1rem; color: var(--slate-900);">
                💻 Projets Réalisés & Validés par l'IA et les Formateurs
              </h3>

              <div *ngIf="portfolio()?.projetsValides?.length; else noProjectsTpl" style="display: flex; flex-direction: column; gap: 1rem;">
                <div *ngFor="let proj of portfolio()?.projetsValides" style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-xl); padding: 1.25rem;">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                    <div>
                      <h4 style="font-size: 1.15rem; color: var(--slate-900); margin: 0;">{{ proj.exerciceTitre }}</h4>
                      <div style="font-size: 0.8rem; color: var(--primary-600); font-weight: 600;">Formation : {{ proj.formationTitre }}</div>
                    </div>
                    <span class="badge badge-success" style="font-size: 0.8rem;">
                      Note : {{ proj.note }} / 100
                    </span>
                  </div>

                  <div style="font-size: 0.85rem; color: var(--slate-700); line-height: 1.5; background: #ffffff; border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 0.75rem; margin: 0.75rem 0;">
                    <strong>Feedback de validation :</strong> {{ proj.feedback }}
                  </div>

                  <div style="display: flex; justify-content: flex-end;">
                    <a [href]="proj.lienDepot" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                      Inspecter le code source (GitHub) ↗
                    </a>
                  </div>
                </div>
              </div>

              <ng-template #noProjectsTpl>
                <div style="font-size: 0.9rem; color: var(--slate-500); font-style: italic;">
                  Aucun projet pratique validé pour le moment.
                </div>
              </ng-template>
            </div>

            <!-- Certificats Officiels FELC -->
            <div *ngIf="portfolio()?.certificats?.length">
              <h3 style="font-size: 1.2rem; margin-bottom: 1rem; color: var(--slate-900);">
                🏆 Certificats Officiels Décrochés
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div *ngFor="let c of portfolio()?.certificats" style="border: 2px solid var(--amber-300); background: var(--amber-50); border-radius: var(--radius-lg); padding: 1.25rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span class="badge badge-success">CERTIFIÉ FELC</span>
                    <strong style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--slate-800);">{{ c.code }}</strong>
                  </div>
                  <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem;">{{ c.formationTitre }}</h4>
                  <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--slate-600);">
                    <span>Score : <strong>{{ c.score }}/100</strong></span>
                    <span>Émis le {{ c.dateEmission | date:'mediumDate' }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <ng-template #loadingTpl>
          <div class="card" style="padding: 4rem; text-align: center;">
            <div class="spinner spinner-primary" style="width: 3rem; height: 3rem;"></div>
            <p style="margin-top: 1rem; color: var(--slate-600);">Chargement du portfolio...</p>
          </div>
        </ng-template>

      </div>
    </div>
  `
})
export class PortfolioComponent implements OnInit {
  id = input<string>(); // Optional: if provided, public view. If not or 'me', own profile.

  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  public portfolio = signal<PortfolioResponse | null>(null);
  public portfolioPublic = signal(true);
  public isOwner = false;

  ngOnInit() {
    const routeId = this.id();
    this.isOwner = !routeId || routeId === 'me';

    if (this.isOwner) {
      if (!this.auth.isLoggedIn()) {
        this.router.navigate(['/auth/login']);
        return;
      }
      this.api.getMonPortfolio().subscribe({
        next: data => {
          this.portfolio.set(data);
          this.chargerStatutUser();
        },
        error: () => this.toast.error('Impossible de charger votre portfolio.')
      });
    } else {
      const targetUserId = Number(routeId);
      if (isNaN(targetUserId)) {
        this.router.navigate(['/']);
        return;
      }
      this.api.getPortfolioPublic(targetUserId).subscribe({
        next: data => this.portfolio.set(data),
        error: () => {
          this.toast.error('Portfolio introuvable ou configuré comme privé.');
          this.router.navigate(['/']);
        }
      });
    }
  }

  chargerStatutUser() {
    this.api.getMonProfil().subscribe({
      next: user => this.portfolioPublic.set(user.portfolioPublic)
    });
  }

  toggleVisibilite() {
    const newState = !this.portfolioPublic();
    this.api.changerVisibilitePortfolio(newState).subscribe({
      next: () => {
        this.portfolioPublic.set(newState);
        this.toast.success(newState ? 'Votre portfolio est maintenant public et partageable !' : 'Votre portfolio est maintenant privé.');
      }
    });
  }
}
