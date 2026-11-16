import { Component, OnInit, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import {
  FormationDetailResponse,
  InscriptionResponse,
  SoumissionResponse,
  ExerciceResponse,
  ModuleResponse
} from '../../core/models/models';

@Component({
  selector: 'app-formation-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div *ngIf="formation()" class="section-py" style="background-color: var(--slate-50); min-height: 85vh;">
      <div class="app-container">
        
        <!-- Header Hero -->
        <div class="card" style="margin-bottom: 2rem; border-left: 6px solid var(--primary-600); box-shadow: var(--shadow-md);">
          <div class="card-body" style="padding: 2.25rem;">
            
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <span class="badge badge-primary">{{ formation()?.domaineNom }}</span>
                <span class="badge badge-success">Niveau {{ formation()?.niveau }}</span>
              </div>
              <div style="font-size: 0.875rem; color: var(--slate-500);">
                Formateur : <strong>{{ formation()?.formateurPrenom }} {{ formation()?.formateurNom }}</strong>
              </div>
            </div>

            <h1 style="font-size: 2.15rem; margin-bottom: 0.75rem; color: var(--slate-900);">
              {{ formation()?.titre }}
            </h1>

            <p style="color: var(--slate-600); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.75rem; max-width: 850px;">
              {{ formation()?.description }}
            </p>

            <!-- Enrollment / Progress Bar -->
            <div *ngIf="inscription(); else notEnrolledTpl" style="background: var(--slate-100); border-radius: var(--radius-xl); padding: 1.25rem; border: 1px solid var(--slate-200);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-weight: 700; font-size: 0.95rem; color: var(--slate-800);">
                  🚀 Votre Progression dans cette formation
                </span>
                <span style="font-weight: 800; font-size: 1.1rem; color: var(--primary-600);">
                  {{ inscription()?.progression }}%
                </span>
              </div>
              <div class="progress-container">
                <div class="progress-bar-fill" [style.width.%]="inscription()?.progression"></div>
              </div>

              <!-- Finished Banner if 100% -->
              <div *ngIf="inscription()?.progression === 100" style="margin-top: 1rem; background: var(--accent-100); border: 1px solid var(--accent-300); border-radius: var(--radius-lg); padding: 0.85rem 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span style="font-size: 1.5rem;">🏆</span>
                  <div>
                    <strong style="color: var(--accent-800);">Félicitations ! Formation terminée avec succès !</strong>
                    <div style="font-size: 0.85rem; color: var(--accent-700);">Votre certificat officiel FELC a été généré.</div>
                  </div>
                </div>
                <a routerLink="/mes-certificats" class="btn btn-accent btn-sm">
                  Voir mon Certificat →
                </a>
              </div>
            </div>

            <ng-template #notEnrolledTpl>
              <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                <button 
                  *ngIf="auth.userRole() === 'APPRENANT'" 
                  (click)="sInscrire()" 
                  [disabled]="inscribing()" 
                  class="btn btn-accent btn-lg"
                >
                  <span *ngIf="inscribing()" class="spinner"></span>
                  <span *ngIf="!inscribing()">🎓 S'inscrire à cette formation (Gratuit)</span>
                </button>
                <div *ngIf="!auth.isLoggedIn()" style="font-size: 0.9rem; color: var(--slate-600);">
                  <a routerLink="/auth/login" style="font-weight: 700;">Connectez-vous</a> pour vous inscrire et soumettre vos projets.
                </div>
              </div>
            </ng-template>

          </div>
        </div>

        <!-- Main Content: Tabs for Modules and Exercices -->
        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 2px solid var(--slate-200);">
          <button 
            (click)="activeTab = 'exercices'"
            [style.color]="activeTab === 'exercices' ? 'var(--primary-600)' : 'var(--slate-500)'"
            [style.border-bottom]="activeTab === 'exercices' ? '3px solid var(--primary-600)' : 'none'"
            style="background: none; border: none; font-weight: 700; font-size: 1.05rem; padding: 0.75rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;"
          >
            <span>💻</span> Exercices & Projets Pratiques ({{ formation()?.exercices?.length || 0 }})
          </button>
          <button 
            (click)="activeTab = 'modules'"
            [style.color]="activeTab === 'modules' ? 'var(--primary-600)' : 'var(--slate-500)'"
            [style.border-bottom]="activeTab === 'modules' ? '3px solid var(--primary-600)' : 'none'"
            style="background: none; border: none; font-weight: 700; font-size: 1.05rem; padding: 0.75rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;"
          >
            <span>📖</span> Modules de Cours ({{ formation()?.modules?.length || 0 }})
          </button>
        </div>

        <!-- Tab 1: Exercices & Soumissions -->
        <div *ngIf="activeTab === 'exercices'" style="display: flex; flex-direction: column; gap: 1.5rem;">
          
          <div *ngFor="let exo of formation()?.exercices; let i = index" class="card" [style.border-left]="exo.projetFinal ? '6px solid var(--amber-500)' : '1px solid var(--slate-200)'">
            <div class="card-body">
              
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-weight: 800; color: var(--slate-400);">#{{ exo.ordre }}</span>
                  <span *ngIf="exo.projetFinal" class="badge badge-warning">🏆 Projet Final Certifiant</span>
                  <span *ngIf="!exo.projetFinal" class="badge badge-slate">Exercice pratique</span>
                </div>

                <!-- Soumission status badge -->
                <div *ngIf="getSoumission(exo.id) as sub">
                  <span class="badge" [ngClass]="getSoumissionBadgeClass(sub.statut)">
                    {{ sub.statut }} ({{ sub.note ?? 0 }}/100)
                  </span>
                </div>
              </div>

              <h3 style="font-size: 1.3rem; margin-bottom: 0.6rem; color: var(--slate-900);">
                {{ exo.titre }}
              </h3>

              <!-- Consignes -->
              <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1rem;">
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase; margin-bottom: 0.35rem;">
                  Consigne :
                </div>
                <div style="color: var(--slate-800); font-size: 0.95rem; line-height: 1.6; white-space: pre-wrap;">
                  {{ exo.consigne }}
                </div>

                <div style="margin-top: 1rem; border-top: 1px dashed var(--slate-200); padding-top: 0.75rem;">
                  <div style="font-size: 0.8rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase; margin-bottom: 0.35rem;">
                    Critères de validation :
                  </div>
                  <div style="color: var(--slate-700); font-size: 0.9rem; line-height: 1.5; white-space: pre-wrap;">
                    {{ exo.criteres }}
                  </div>
                </div>
              </div>

              <!-- Soumission Area if Enrolled -->
              <div *ngIf="inscription()">
                
                <!-- If already submitted -->
                <div *ngIf="getSoumission(exo.id) as sub" style="background: #ffffff; border: 1px solid var(--slate-200); border-radius: var(--radius-lg); padding: 1.25rem; margin-top: 1rem;">
                  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem;">
                    <div>
                      <span style="font-size: 0.8rem; color: var(--slate-500);">Dépôt soumis :</span>
                      <a [href]="sub.lienDepot" target="_blank" rel="noopener" style="font-weight: 700; margin-left: 0.5rem; word-break: break-all;">
                        🔗 {{ sub.lienDepot }}
                      </a>
                    </div>

                    <!-- AI Correction Button -->
                    <button 
                      *ngIf="sub.statut !== 'VALIDEE'" 
                      (click)="corrigerAvecIa(sub.id)" 
                      [disabled]="correctingIaId() === sub.id" 
                      class="btn btn-accent btn-sm"
                      style="box-shadow: var(--shadow-emerald-glow);"
                    >
                      <span *ngIf="correctingIaId() === sub.id" class="spinner"></span>
                      <span *ngIf="correctingIaId() !== sub.id">✨ Corriger immédiatement avec l'IA</span>
                    </button>
                  </div>

                  <!-- Feedback section -->
                  <div *ngIf="sub.feedback" style="background: var(--slate-50); border-left: 4px solid var(--primary-500); padding: 0.85rem 1rem; border-radius: var(--radius-md); font-size: 0.9rem; margin-top: 0.5rem;">
                    <strong>Feedback d'évaluation (Note : {{ sub.note }}/100) :</strong>
                    <div style="color: var(--slate-700); margin-top: 0.3rem; white-space: pre-wrap;">{{ sub.feedback }}</div>
                  </div>

                  <!-- Re-submit if A_REVOIR -->
                  <div *ngIf="sub.statut === 'A_REVOIR'" style="margin-top: 1rem;">
                    <button (click)="openSubmitModal(exo)" class="btn btn-outline btn-sm">
                      🔄 Resoumettre une version corrigée
                    </button>
                  </div>
                </div>

                <!-- If not submitted yet -->
                <div *ngIf="!getSoumission(exo.id)" style="margin-top: 1rem;">
                  <button (click)="openSubmitModal(exo)" class="btn btn-primary btn-sm">
                    📤 Soumettre mon lien de projet (GitHub)
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>

        <!-- Tab 2: Modules de Cours -->
        <div *ngIf="activeTab === 'modules'" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div *ngFor="let mod of formation()?.modules" class="card">
            <div class="card-header">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span class="badge badge-primary">Module {{ mod.ordre }}</span>
                <h3 style="font-size: 1.15rem; margin: 0;">{{ mod.titre }}</h3>
              </div>
            </div>
            <div class="card-body">
              <div style="color: var(--slate-700); font-size: 0.95rem; line-height: 1.7; white-space: pre-wrap;">
                {{ mod.contenu }}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Submission Modal -->
    <div *ngIf="showSubmitModal" class="modal-overlay">
      <div class="modal-content" style="padding: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.35rem; margin: 0;">Soumettre votre travail</h3>
          <button (click)="showSubmitModal = false" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        </div>

        <div style="margin-bottom: 1rem; font-size: 0.9rem; color: var(--slate-600);">
          Exercice : <strong>{{ currentExercice?.titre }}</strong>
        </div>

        <form (ngSubmit)="envoyerSoumission()">
          <div class="form-group">
            <label class="form-label">Lien du dépôt GitHub public</label>
            <input 
              type="url" 
              name="lienDepot" 
              [(ngModel)]="submissionLien" 
              required 
              class="form-input" 
              placeholder="https://github.com/mon-compte/mon-projet"
            >
            <div style="font-size: 0.78rem; color: var(--slate-500); margin-top: 0.3rem;">
              Le dépôt doit être public pour permettre l'inspection par l'IA et le formateur.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Commentaire ou note pour l'évaluateur (optionnel)</label>
            <textarea 
              name="commentaire" 
              [(ngModel)]="submissionCommentaire" 
              class="form-textarea" 
              placeholder="Ex : J'ai implémenté toutes les entités et configuré la sécurité JWT avec tests unitaires..."
            ></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" (click)="showSubmitModal = false" class="btn btn-outline">
              Annuler
            </button>
            <button type="submit" [disabled]="submitting()" class="btn btn-primary">
              <span *ngIf="submitting()" class="spinner"></span>
              <span *ngIf="!submitting()">Confirmer la soumission</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class FormationDetailComponent implements OnInit {
  id = input.required<string>(); // Route param

  private api = inject(ApiService);
  public auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  public formation = signal<FormationDetailResponse | null>(null);
  public inscription = signal<InscriptionResponse | null>(null);
  public mesSoumissions = signal<SoumissionResponse[]>([]);

  public activeTab: 'exercices' | 'modules' = 'exercices';
  public inscribing = signal(false);
  public correctingIaId = signal<number | null>(null);

  // Modal
  public showSubmitModal = false;
  public currentExercice: ExerciceResponse | null = null;
  public submissionLien = '';
  public submissionCommentaire = '';
  public submitting = signal(false);

  ngOnInit() {
    const formationId = Number(this.id());
    if (isNaN(formationId)) return;

    this.api.getFormationById(formationId).subscribe({
      next: data => {
        this.formation.set(data);
        this.verifierInscription(formationId);
      },
      error: () => {
        this.toast.error('Formation introuvable.');
        this.router.navigate(['/formations']);
      }
    });
  }

  verifierInscription(formationId: number) {
    if (!this.auth.isLoggedIn() || this.auth.userRole() !== 'APPRENANT') return;

    this.api.getMesInscriptions().subscribe({
      next: (list) => {
        const found = list.find(i => i.formationId === formationId);
        if (found) {
          this.inscription.set(found);
          this.chargerMesSoumissions();
        }
      }
    });
  }

  chargerMesSoumissions() {
    this.api.getMesSoumissions().subscribe({
      next: data => this.mesSoumissions.set(data)
    });
  }

  getSoumission(exerciceId: number): SoumissionResponse | undefined {
    return this.mesSoumissions().find(s => s.exerciceId === exerciceId);
  }

  sInscrire() {
    const formId = this.formation()?.id;
    if (!formId) return;

    this.inscribing.set(true);
    this.api.inscrire(formId).subscribe({
      next: (insc) => {
        this.inscribing.set(false);
        this.inscription.set(insc);
        this.toast.success('Félicitations, vous êtes inscrit à cette formation !');
        this.chargerMesSoumissions();
      },
      error: (err) => {
        this.inscribing.set(false);
        const msg = err.error?.message || 'Erreur lors de l\'inscription.';
        this.toast.error(msg);
      }
    });
  }

  openSubmitModal(exo: ExerciceResponse) {
    this.currentExercice = exo;
    this.submissionLien = '';
    this.submissionCommentaire = '';
    this.showSubmitModal = true;
  }

  envoyerSoumission() {
    if (!this.currentExercice || !this.submissionLien) {
      this.toast.error('Veuillez renseigner le lien de votre dépôt GitHub.');
      return;
    }

    this.submitting.set(true);
    this.api.soumettreExercice(this.currentExercice.id, {
      lienDepot: this.submissionLien,
      commentaire: this.submissionCommentaire
    }).subscribe({
      next: (sub) => {
        this.submitting.set(false);
        this.showSubmitModal = false;
        this.toast.success('Projet soumis avec succès ! Vous pouvez maintenant lancer la correction par IA.');
        this.chargerMesSoumissions();
        this.actualiserInscription();
      },
      error: (err) => {
        this.submitting.set(false);
        const msg = err.error?.message || 'Erreur lors de la soumission.';
        this.toast.error(msg);
      }
    });
  }

  corrigerAvecIa(soumissionId: number) {
    this.correctingIaId.set(soumissionId);
    this.toast.info('L\'IA Claude inspecte actuellement votre dépôt GitHub (README, architecture, code source)...');

    this.api.corrigerSoumissionIa(soumissionId).subscribe({
      next: (res) => {
        this.correctingIaId.set(null);
        if (res.statut === 'VALIDEE') {
          this.toast.success(`Exercice validé avec succès ! Note : ${res.note}/100 🏆`);
        } else {
          this.toast.error(`Exercice à revoir (Note : ${res.note}/100). Consultez le feedback pour corriger.`);
        }
        this.chargerMesSoumissions();
        this.actualiserInscription();
      },
      error: (err) => {
        this.correctingIaId.set(null);
        const msg = err.error?.message || 'Erreur lors de la correction automatique par l\'IA.';
        this.toast.error(msg);
      }
    });
  }

  actualiserInscription() {
    const formId = this.formation()?.id;
    if (formId) {
      this.verifierInscription(formId);
    }
  }

  getSoumissionBadgeClass(statut: string): string {
    switch (statut) {
      case 'VALIDEE': return 'badge-success';
      case 'A_REVOIR': return 'badge-danger';
      default: return 'badge-warning';
    }
  }
}
