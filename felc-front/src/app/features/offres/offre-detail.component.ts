import { Component, OnInit, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { OffreResponse, CandidatureResponse } from '../../core/models/models';

@Component({
  selector: 'app-offre-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div *ngIf="offre()" class="section-py" style="background-color: var(--slate-50); min-height: 85vh;">
      <div class="app-container" style="max-width: 900px;">
        
        <div style="margin-bottom: 1.5rem;">
          <a routerLink="/offres" style="font-size: 0.9rem; font-weight: 600; color: var(--slate-600); display: inline-flex; align-items: center; gap: 0.4rem;">
            ← Retour aux offres
          </a>
        </div>

        <div class="card" style="margin-bottom: 2rem; box-shadow: var(--shadow-md);">
          <div class="card-body" style="padding: 2.5rem;">
            
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="badge" [ngClass]="offre()?.type === 'MISSION' ? 'badge-purple' : 'badge-primary'">
                  {{ offre()?.type }}
                </span>
                <span *ngIf="offre()?.remote" class="badge badge-success">🌐 Télétravail autorisé</span>
                <span class="badge badge-slate">{{ offre()?.domaineNom }}</span>
              </div>
              <span class="badge" [ngClass]="offre()?.statut === 'OUVERTE' ? 'badge-success' : 'badge-danger'">
                {{ offre()?.statut === 'OUVERTE' ? 'OFFRE ACTIVE' : 'FERMÉE' }}
              </span>
            </div>

            <h1 style="font-size: 2.15rem; margin-bottom: 0.5rem; color: var(--slate-900);">
              {{ offre()?.titre }}
            </h1>

            <div style="font-size: 1.05rem; font-weight: 600; color: var(--primary-600); margin-bottom: 1.5rem;">
              🏢 {{ offre()?.entrepriseNom }} • 📍 {{ offre()?.localisation }}
            </div>

            <!-- Highlights Box -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-xl); padding: 1.25rem; margin-bottom: 2rem;" class="md:grid-cols-3">
              <div>
                <div style="font-size: 0.75rem; color: var(--slate-500); font-weight: 700; text-transform: uppercase;">Budget / Rémunération</div>
                <div style="font-size: 1.35rem; font-weight: 800; color: var(--slate-900);">
                  {{ offre()?.budget | number }} FCFA
                </div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--slate-500); font-weight: 700; text-transform: uppercase;">Expérience minimale</div>
                <div style="font-size: 1.15rem; font-weight: 700; color: var(--slate-800); margin-top: 0.2rem;">
                  {{ offre()?.experienceMin }} an(s)
                </div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--slate-500); font-weight: 700; text-transform: uppercase;">Date de publication</div>
                <div style="font-size: 0.95rem; font-weight: 600; color: var(--slate-800); margin-top: 0.2rem;">
                  {{ offre()?.datePublication | date:'mediumDate' }}
                </div>
              </div>
            </div>

            <!-- Description -->
            <div style="margin-bottom: 2.5rem;">
              <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--slate-900);">Description de la mission / du poste</h3>
              <div style="color: var(--slate-700); font-size: 1rem; line-height: 1.7; white-space: pre-wrap;">
                {{ offre()?.description }}
              </div>
            </div>

            <!-- Postuler CTA -->
            <div style="border-top: 1px solid var(--slate-200); padding-top: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
              <div *ngIf="existingCandidature(); else notAppliedTpl">
                <span class="badge badge-success" style="font-size: 0.9rem; padding: 0.4rem 0.85rem;">
                  ✓ Vous avez postulé à cette offre (Statut : {{ existingCandidature()?.statut }})
                </span>
              </div>

              <ng-template #notAppliedTpl>
                <div *ngIf="offre()?.statut === 'OUVERTE'; else closedTpl">
                  <button 
                    *ngIf="auth.userRole() === 'APPRENANT'" 
                    (click)="showApplyModal = true" 
                    class="btn btn-primary btn-lg"
                    style="box-shadow: var(--shadow-glow);"
                  >
                    📩 Postuler à cette offre
                  </button>
                  <div *ngIf="!auth.isLoggedIn()" style="font-size: 0.9rem; color: var(--slate-600);">
                    <a routerLink="/auth/login" style="font-weight: 700;">Connectez-vous en tant qu'apprenant</a> pour soumettre votre candidature.
                  </div>
                </div>
                <ng-template #closedTpl>
                  <span class="badge badge-danger">Cette offre est fermée aux candidatures</span>
                </ng-template>
              </ng-template>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- Application Modal -->
    <div *ngIf="showApplyModal" class="modal-overlay">
      <div class="modal-content" style="padding: 2.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.35rem; margin: 0;">Postuler : {{ offre()?.titre }}</h3>
          <button (click)="showApplyModal = false" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        </div>

        <form (ngSubmit)="envoyerCandidature()">
          <div class="form-group">
            <label class="form-label">Message de motivation pour l'entreprise</label>
            <textarea 
              name="message" 
              [(ngModel)]="applyMessage" 
              required 
              class="form-textarea"
              style="min-height: 120px;"
              placeholder="Expliquez pourquoi vos compétences pratiques et projets validés sur FELC correspondent à cette offre..."
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Lien vers votre portfolio ou profil public (optionnel)</label>
            <input 
              type="url" 
              name="portfolioLink" 
              [(ngModel)]="applyPortfolio" 
              class="form-input" 
              placeholder="https://felc.tg/portfolio/42 ou lien GitHub"
            >
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" (click)="showApplyModal = false" class="btn btn-outline">
              Annuler
            </button>
            <button type="submit" [disabled]="submitting()" class="btn btn-primary">
              <span *ngIf="submitting()" class="spinner"></span>
              <span *ngIf="!submitting()">Envoyer ma candidature</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class OffreDetailComponent implements OnInit {
  id = input.required<string>();

  private api = inject(ApiService);
  public auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  public offre = signal<OffreResponse | null>(null);
  public existingCandidature = signal<CandidatureResponse | null>(null);

  // Modal
  public showApplyModal = false;
  public applyMessage = '';
  public applyPortfolio = '';
  public submitting = signal(false);

  ngOnInit() {
    const offreId = Number(this.id());
    if (isNaN(offreId)) return;

    this.api.getOffreById(offreId).subscribe({
      next: data => {
        this.offre.set(data);
        this.verifierCandidature(offreId);
      },
      error: () => {
        this.toast.error('Offre introuvable.');
        this.router.navigate(['/offres']);
      }
    });
  }

  verifierCandidature(offreId: number) {
    if (!this.auth.isLoggedIn() || this.auth.userRole() !== 'APPRENANT') return;

    this.api.getMesCandidatures().subscribe({
      next: (list) => {
        const found = list.find(c => c.offreId === offreId);
        if (found) {
          this.existingCandidature.set(found);
        }
      }
    });
  }

  envoyerCandidature() {
    const offId = this.offre()?.id;
    if (!offId || !this.applyMessage.trim()) {
      this.toast.error('Veuillez renseigner votre message de candidature.');
      return;
    }

    this.submitting.set(true);
    this.api.postuler(offId, {
      message: this.applyMessage,
      lienPortfolio: this.applyPortfolio
    }).subscribe({
      next: (cand) => {
        this.submitting.set(false);
        this.showApplyModal = false;
        this.existingCandidature.set(cand);
        this.toast.success('Votre candidature a été transmise à l\'entreprise avec succès !');
      },
      error: (err) => {
        this.submitting.set(false);
        const msg = err.error?.message || 'Erreur lors de l\'envoi de votre candidature.';
        this.toast.error(msg);
      }
    });
  }
}
