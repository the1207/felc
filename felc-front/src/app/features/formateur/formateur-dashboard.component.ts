import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { FormationResponse, DomaineResponse, SoumissionResponse } from '../../core/models/models';

@Component({
  selector: 'app-formateur-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="background-color: var(--slate-50); min-height: 85vh;">
      <div class="app-container">
        
        <!-- Header -->
        <div style="margin-bottom: 2.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge badge-purple" style="margin-bottom: 0.5rem;">Espace Pédagogique</span>
            <h1 style="font-size: 2.25rem; margin-bottom: 0.25rem;">Tableau de Bord Formateur</h1>
            <p style="color: var(--slate-600); font-size: 1rem;">
              Créez des parcours 100% pratiques et évaluez les soumissions de projets des apprenants.
            </p>
          </div>
          <button (click)="openCreateCourseModal()" class="btn btn-primary btn-lg" style="box-shadow: var(--shadow-glow);">
            ➕ Créer une formation pratique
          </button>
        </div>

        <!-- Section: Soumissions à Évaluer -->
        <div style="margin-bottom: 3.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
            <h2 style="font-size: 1.45rem; color: var(--slate-900); display: flex; align-items: center; gap: 0.5rem;">
              <span>📝</span> Soumissions d'exercices en attente d'évaluation ({{ aEvaluer().length }})
            </h2>
          </div>

          <div *ngIf="aEvaluer().length > 0; else noPendingTpl" class="card">
            <div class="card-body" style="padding: 0;">
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                  <thead>
                    <tr style="border-bottom: 2px solid var(--slate-200); background: var(--slate-50); color: var(--slate-600); font-weight: 700;">
                      <th style="padding: 0.85rem 1.25rem;">Apprenant</th>
                      <th style="padding: 0.85rem 1.25rem;">Exercice</th>
                      <th style="padding: 0.85rem 1.25rem;">Dépôt GitHub</th>
                      <th style="padding: 0.85rem 1.25rem;">Date</th>
                      <th style="padding: 0.85rem 1.25rem; text-align: right;">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let sub of aEvaluer()" style="border-bottom: 1px solid var(--slate-100);">
                      <td style="padding: 1rem 1.25rem; font-weight: 700; color: var(--slate-900);">
                        {{ sub.apprenantNom }}
                      </td>
                      <td style="padding: 1rem 1.25rem;">
                        {{ sub.exerciceTitre }}
                      </td>
                      <td style="padding: 1rem 1.25rem;">
                        <a [href]="sub.lienDepot" target="_blank" rel="noopener" style="color: var(--primary-600); font-weight: 600;">
                          Inspecter GitHub ↗
                        </a>
                      </td>
                      <td style="padding: 1rem 1.25rem; color: var(--slate-500); font-size: 0.825rem;">
                        {{ sub.dateSoumission | date:'short' }}
                      </td>
                      <td style="padding: 1rem 1.25rem; text-align: right;">
                        <button (click)="openEvalModal(sub)" class="btn btn-accent btn-sm">
                          Évaluer & Noter
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <ng-template #noPendingTpl>
            <div class="card" style="padding: 2.5rem; text-align: center; color: var(--slate-500);">
              ✓ Aucune soumission en attente d'évaluation manuelle pour le moment.
            </div>
          </ng-template>
        </div>

        <!-- Section: Mes Formations Pédagogiques -->
        <div>
          <h2 style="font-size: 1.45rem; color: var(--slate-900); margin-bottom: 1.25rem;">
            Mes Formations Actives ({{ mesFormations().length }})
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div *ngFor="let form of mesFormations()" class="card card-hover">
              <div class="card-body">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                  <span class="badge badge-primary">{{ form.domaineCode }}</span>
                  <span class="badge badge-slate">{{ form.niveau }}</span>
                </div>
                <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">{{ form.titre }}</h3>
                <p style="font-size: 0.875rem; color: var(--slate-600); line-height: 1.5; margin-bottom: 1.25rem;">
                  {{ form.description.slice(0, 100) }}...
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--slate-100); padding-top: 0.85rem;">
                  <a [routerLink]="['/formations', form.id]" class="btn btn-outline btn-sm">
                    Gérer le contenu
                  </a>
                  <button (click)="openAddExoModal(form.id)" class="btn btn-primary btn-sm">
                    ➕ Exercice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Create Course Modal -->
    <div *ngIf="showCreateModal" class="modal-overlay">
      <div class="modal-content" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.35rem; margin: 0;">Créer une formation pratique</h3>
          <button (click)="showCreateModal = false" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        </div>

        <form (ngSubmit)="creerFormation()">
          <div class="form-group">
            <label class="form-label">Titre de la formation</label>
            <input type="text" name="titre" [(ngModel)]="nouvelleFormation.titre" required class="form-input" placeholder="Ex : Architecture Microservices Spring Boot & Docker">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Niveau</label>
              <select name="niveau" [(ngModel)]="nouvelleFormation.niveau" class="form-select">
                <option value="DEBUTANT">Débutant</option>
                <option value="INTERMEDIAIRE">Intermédiaire</option>
                <option value="AVANCE">Avancé</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Domaine / Filière</label>
              <select name="domaineId" [(ngModel)]="nouvelleFormation.domaineId" class="form-select" required>
                <option *ngFor="let dom of domaines()" [ngValue]="dom.id">{{ dom.nom }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description pédagogique et compétences visées</label>
            <textarea name="description" [(ngModel)]="nouvelleFormation.description" required class="form-textarea" placeholder="Détaillez le fil conducteur pratique de la formation..."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" (click)="showCreateModal = false" class="btn btn-outline">Annuler</button>
            <button type="submit" [disabled]="submittingForm()" class="btn btn-primary">
              <span *ngIf="submittingForm()" class="spinner"></span>
              <span *ngIf="!submittingForm()">Créer la formation</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Evaluation Modal -->
    <div *ngIf="showEvalModal" class="modal-overlay">
      <div class="modal-content" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.35rem; margin: 0;">Évaluation de la soumission</h3>
          <button (click)="showEvalModal = false" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        </div>

        <div style="margin-bottom: 1rem; background: var(--slate-50); padding: 1rem; border-radius: var(--radius-md);">
          <div>Apprenant : <strong>{{ currentSub?.apprenantNom }}</strong></div>
          <div>Exercice : <strong>{{ currentSub?.exerciceTitre }}</strong></div>
          <div>Dépôt : <a [href]="currentSub?.lienDepot" target="_blank" rel="noopener">{{ currentSub?.lienDepot }}</a></div>
        </div>

        <form (ngSubmit)="validerEvaluation()">
          <div class="form-group">
            <label class="form-label">Note attribuée (0 à 100) — Note &ge; 70 valide l'exercice</label>
            <input type="number" name="evalNote" [(ngModel)]="evalNote" min="0" max="100" required class="form-input" placeholder="85">
          </div>

          <div class="form-group">
            <label class="form-label">Feedback constructif pour l'apprenant</label>
            <textarea name="evalFeedback" [(ngModel)]="evalFeedback" required class="form-textarea" placeholder="Remarques sur le code, points forts, axes d'amélioration..."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" (click)="showEvalModal = false" class="btn btn-outline">Annuler</button>
            <button type="submit" [disabled]="evaluating()" class="btn btn-accent">
              <span *ngIf="evaluating()" class="spinner"></span>
              <span *ngIf="!evaluating()">Enregistrer l'évaluation</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Exercise Modal -->
    <div *ngIf="showAddExoModal" class="modal-overlay">
      <div class="modal-content" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.35rem; margin: 0;">Ajouter un exercice pratique</h3>
          <button (click)="showAddExoModal = false" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        </div>

        <form (ngSubmit)="creerExercice()">
          <div class="form-group">
            <label class="form-label">Titre de l'exercice</label>
            <input type="text" name="exoTitre" [(ngModel)]="nouvelExercice.titre" required class="form-input" placeholder="Ex : Création des entités et repositories JPA">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Numéro d'ordre</label>
              <input type="number" name="exoOrdre" [(ngModel)]="nouvelExercice.ordre" min="1" required class="form-input">
            </div>
            <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1.75rem;">
              <input type="checkbox" id="modalFinal" name="projetFinal" [(ngModel)]="nouvelExercice.projetFinal" style="width: 1.25rem; height: 1.25rem;">
              <label for="modalFinal" style="font-size: 0.9rem; font-weight: 600; color: var(--slate-700);">🏆 Est un Projet Final</label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Consigne détaillée</label>
            <textarea name="exoConsigne" [(ngModel)]="nouvelExercice.consigne" required class="form-textarea" placeholder="Décrivez les fonctionnalités à développer..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Critères de validation (pour l'IA et le formateur)</label>
            <textarea name="exoCriteres" [(ngModel)]="nouvelExercice.criteres" required class="form-textarea" placeholder="Points spécifiques à vérifier dans le code source..."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" (click)="showAddExoModal = false" class="btn btn-outline">Annuler</button>
            <button type="submit" [disabled]="submittingExo()" class="btn btn-primary">
              <span *ngIf="submittingExo()" class="spinner"></span>
              <span *ngIf="!submittingExo()">Ajouter l'exercice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class FormateurDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  public mesFormations = signal<FormationResponse[]>([]);
  public aEvaluer = signal<SoumissionResponse[]>([]);
  public domaines = signal<DomaineResponse[]>([]);

  // Create course
  public showCreateModal = false;
  public submittingForm = signal(false);
  public nouvelleFormation = {
    titre: '',
    description: '',
    niveau: 'DEBUTANT',
    domaineId: 1
  };

  // Eval
  public showEvalModal = false;
  public currentSub: SoumissionResponse | null = null;
  public evalNote = 80;
  public evalFeedback = '';
  public evaluating = signal(false);

  // Add exercise
  public showAddExoModal = false;
  public targetFormationId: number | null = null;
  public submittingExo = signal(false);
  public nouvelExercice = {
    titre: '',
    consigne: '',
    criteres: '',
    ordre: 1,
    projetFinal: false
  };

  ngOnInit() {
    this.chargerDonnees();
    this.api.getDomaines().subscribe({
      next: data => {
        this.domaines.set(data);
        if (data.length > 0) this.nouvelleFormation.domaineId = data[0].id;
      }
    });
  }

  chargerDonnees() {
    this.api.getFormations().subscribe({
      next: data => this.mesFormations.set(data)
    });

    this.api.getSoumissionsAEvaluer().subscribe({
      next: data => this.aEvaluer.set(data)
    });
  }

  openCreateCourseModal() {
    this.showCreateModal = true;
  }

  creerFormation() {
    this.submittingForm.set(true);
    this.api.createFormation(this.nouvelleFormation).subscribe({
      next: () => {
        this.submittingForm.set(false);
        this.showCreateModal = false;
        this.toast.success('Formation créée avec succès !');
        this.chargerDonnees();
      },
      error: (err) => {
        this.submittingForm.set(false);
        const msg = err.error?.message || 'Erreur lors de la création.';
        this.toast.error(msg);
      }
    });
  }

  openEvalModal(sub: SoumissionResponse) {
    this.currentSub = sub;
    this.evalNote = sub.note || 80;
    this.evalFeedback = sub.feedback || '';
    this.showEvalModal = true;
  }

  validerEvaluation() {
    if (!this.currentSub) return;

    this.evaluating.set(true);
    this.api.evaluerSoumission(this.currentSub.id, {
      note: this.evalNote,
      feedback: this.evalFeedback
    }).subscribe({
      next: () => {
        this.evaluating.set(false);
        this.showEvalModal = false;
        this.toast.success('Évaluation enregistrée avec succès !');
        this.chargerDonnees();
      },
      error: (err) => {
        this.evaluating.set(false);
        const msg = err.error?.message || 'Erreur lors de l\'évaluation.';
        this.toast.error(msg);
      }
    });
  }

  openAddExoModal(formationId: number) {
    this.targetFormationId = formationId;
    this.nouvelExercice = {
      titre: '',
      consigne: '',
      criteres: '',
      ordre: 1,
      projetFinal: false
    };
    this.showAddExoModal = true;
  }

  creerExercice() {
    if (!this.targetFormationId) return;

    this.submittingExo.set(true);
    this.api.createExercice(this.targetFormationId, this.nouvelExercice).subscribe({
      next: () => {
        this.submittingExo.set(false);
        this.showAddExoModal = false;
        this.toast.success('Exercice ajouté avec succès à la formation !');
      },
      error: (err) => {
        this.submittingExo.set(false);
        const msg = err.error?.message || 'Erreur lors de l\'ajout de l\'exercice.';
        this.toast.error(msg);
      }
    });
  }
}
