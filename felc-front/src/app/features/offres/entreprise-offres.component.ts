import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { OffreResponse, DomaineResponse, CandidatureResponse } from '../../core/models/models';

@Component({
  selector: 'app-entreprise-offres',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="background-color: var(--slate-50); min-height: 85vh;">
      <div class="app-container">
        
        <!-- Header -->
        <div style="margin-bottom: 2.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge badge-warning" style="margin-bottom: 0.5rem;">Espace Recruteur</span>
            <h1 style="font-size: 2.25rem; margin-bottom: 0.25rem;">Gestion de vos Offres & Candidatures</h1>
            <p style="color: var(--slate-600); font-size: 1rem;">
              Publiez des opportunités d'emploi ou des missions freelance et recrutez des talents vérifiés par FELC.
            </p>
          </div>
          <button (click)="openCreateModal()" class="btn btn-primary btn-lg" style="box-shadow: var(--shadow-glow);">
            ➕ Publier une nouvelle offre
          </button>
        </div>

        <!-- Offres List -->
        <div *ngIf="offres().length > 0; else noOffresTpl" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div *ngFor="let off of offres()" class="card" style="box-shadow: var(--shadow-sm);">
            <div class="card-body">
              
              <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                    <span class="badge" [ngClass]="off.type === 'MISSION' ? 'badge-purple' : 'badge-primary'">{{ off.type }}</span>
                    <span *ngIf="off.remote" class="badge badge-success">🌐 Remote</span>
                    <span class="badge badge-slate">{{ off.domaineNom }}</span>
                    <span class="badge" [ngClass]="off.statut === 'OUVERTE' ? 'badge-success' : 'badge-danger'">
                      {{ off.statut }}
                    </span>
                  </div>
                  <h2 style="font-size: 1.35rem; color: var(--slate-900); margin: 0;">{{ off.titre }}</h2>
                  <div style="font-size: 0.85rem; color: var(--slate-500); margin-top: 0.25rem;">
                    📍 {{ off.localisation }} • Rémunération : <strong>{{ off.budget | number }} FCFA</strong> • Publiée le {{ off.datePublication | date:'mediumDate' }}
                  </div>
                </div>

                <!-- Action buttons -->
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <button 
                    (click)="toggleStatut(off)" 
                    class="btn btn-outline btn-sm"
                  >
                    {{ off.statut === 'OUVERTE' ? '🔒 Fermer' : '🔓 Rouvrir' }}
                  </button>
                  <button 
                    (click)="chargerCandidatures(off.id)" 
                    class="btn btn-primary btn-sm"
                  >
                    👥 Candidatures reçues
                  </button>
                </div>
              </div>

              <!-- Collapsible Candidatures Section -->
              <div *ngIf="selectedOffreId() === off.id" style="border-top: 1px dashed var(--slate-200); padding-top: 1.25rem; margin-top: 1.25rem;">
                <h4 style="font-size: 1rem; margin-bottom: 1rem; color: var(--slate-800);">
                  Candidatures reçues pour cette offre ({{ candidatures().length }}) :
                </h4>

                <div *ngIf="candidatures().length > 0; else noCandTpl" style="display: flex; flex-direction: column; gap: 1rem;">
                  <div *ngFor="let cand of candidatures()" style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-lg); padding: 1.25rem;">
                    
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                      <div>
                        <strong style="font-size: 1.05rem; color: var(--slate-900);">{{ cand.candidatPrenom }} {{ cand.candidatNom }}</strong>
                        <span style="font-size: 0.85rem; color: var(--slate-500); margin-left: 0.5rem;">({{ cand.candidatEmail }})</span>
                      </div>
                      <span class="badge" [ngClass]="getCandidatureBadgeClass(cand.statut)">
                        {{ cand.statut }}
                      </span>
                    </div>

                    <div style="font-size: 0.9rem; color: var(--slate-700); line-height: 1.5; margin-bottom: 0.75rem; white-space: pre-wrap;">
                      {{ cand.message }}
                    </div>

                    <div *ngIf="cand.lienPortfolio" style="margin-bottom: 0.75rem;">
                      <a [href]="cand.lienPortfolio" target="_blank" rel="noopener" style="font-size: 0.85rem; font-weight: 700; color: var(--primary-600);">
                        🔗 Consulter le Portfolio du candidat ↗
                      </a>
                    </div>

                    <!-- Change status buttons -->
                    <div style="display: flex; gap: 0.5rem; align-items: center; border-top: 1px solid var(--slate-200); padding-top: 0.75rem;">
                      <span style="font-size: 0.8rem; font-weight: 600; color: var(--slate-500);">Changer le statut :</span>
                      <button (click)="changerStatutCand(cand.id, 'VUE')" class="btn btn-outline btn-sm">Marquer Vue</button>
                      <button (click)="changerStatutCand(cand.id, 'ACCEPTEE')" class="btn btn-accent btn-sm">Accepter ✅</button>
                      <button (click)="changerStatutCand(cand.id, 'REFUSEE')" class="btn btn-danger btn-sm">Refuser ❌</button>
                    </div>

                  </div>
                </div>

                <ng-template #noCandTpl>
                  <div style="font-size: 0.875rem; color: var(--slate-500); font-style: italic;">
                    Aucune candidature reçue pour le moment pour cette offre.
                  </div>
                </ng-template>
              </div>

            </div>
          </div>
        </div>

        <ng-template #noOffresTpl>
          <div class="card" style="padding: 4rem 2rem; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🏢</div>
            <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Vous n'avez publié aucune offre pour le moment</h3>
            <p style="color: var(--slate-500); margin-bottom: 1.5rem;">
              Créez votre première offre d'emploi ou mission pour recruter les talents certifiés FELC.
            </p>
            <button (click)="openCreateModal()" class="btn btn-primary">
              ➕ Créer une offre
            </button>
          </div>
        </ng-template>

      </div>
    </div>

    <!-- Create Offer Modal -->
    <div *ngIf="showCreateModal" class="modal-overlay">
      <div class="modal-content" style="padding: 2.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.35rem; margin: 0;">Publier une nouvelle opportunité</h3>
          <button (click)="showCreateModal = false" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        </div>

        <form (ngSubmit)="creerOffre()">
          
          <div class="form-group">
            <label class="form-label">Titre de l'offre</label>
            <input type="text" name="titre" [(ngModel)]="nouvelleOffre.titre" required class="form-input" placeholder="Ex : Développeur Fullstack Java / Angular Junior">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Type d'offre</label>
              <select name="type" [(ngModel)]="nouvelleOffre.type" class="form-select">
                <option value="EMPLOI">Emploi (CDI / CDD / Stage)</option>
                <option value="MISSION">Mission Freelance</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Filière / Domaine</label>
              <select name="domaineId" [(ngModel)]="nouvelleOffre.domaineId" class="form-select" required>
                <option *ngFor="let dom of domaines()" [ngValue]="dom.id">{{ dom.nom }}</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Localisation</label>
              <input type="text" name="localisation" [(ngModel)]="nouvelleOffre.localisation" required class="form-input" placeholder="Lomé, Togo">
            </div>
            <div class="form-group">
              <label class="form-label">Budget / Salaire (en FCFA)</label>
              <input type="number" name="budget" [(ngModel)]="nouvelleOffre.budget" required class="form-input" placeholder="500000">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Expérience minimale (en années)</label>
              <input type="number" name="experienceMin" [(ngModel)]="nouvelleOffre.experienceMin" min="0" class="form-input" placeholder="0 pour junior">
            </div>
            <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1.75rem;">
              <input type="checkbox" id="modalRemote" name="remote" [(ngModel)]="nouvelleOffre.remote" style="width: 1.25rem; height: 1.25rem;">
              <label for="modalRemote" style="font-size: 0.9rem; font-weight: 600; color: var(--slate-700);">Télétravail autorisé</label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description du poste et missions</label>
            <textarea name="description" [(ngModel)]="nouvelleOffre.description" required class="form-textarea" style="min-height: 120px;" placeholder="Détaillez les tâches, les compétences techniques requises et les avantages offerts..."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" (click)="showCreateModal = false" class="btn btn-outline">Annuler</button>
            <button type="submit" [disabled]="submitting()" class="btn btn-primary">
              <span *ngIf="submitting()" class="spinner"></span>
              <span *ngIf="!submitting()">Publier l'offre</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  `
})
export class EntrepriseOffresComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  public offres = signal<OffreResponse[]>([]);
  public domaines = signal<DomaineResponse[]>([]);
  public candidatures = signal<CandidatureResponse[]>([]);
  public selectedOffreId = signal<number | null>(null);

  public showCreateModal = false;
  public submitting = signal(false);

  public nouvelleOffre = {
    titre: '',
    description: '',
    type: 'EMPLOI',
    domaineId: 1,
    localisation: 'Lomé, Togo',
    remote: false,
    experienceMin: 0,
    budget: 450000
  };

  ngOnInit() {
    this.chargerOffres();
    this.api.getDomaines().subscribe({
      next: data => {
        this.domaines.set(data);
        if (data.length > 0) this.nouvelleOffre.domaineId = data[0].id;
      }
    });
  }

  chargerOffres() {
    this.api.getMesOffres().subscribe({
      next: data => this.offres.set(data)
    });
  }

  toggleStatut(off: OffreResponse) {
    const nouveauStatut = off.statut === 'OUVERTE' ? 'FERMEE' : 'OUVERTE';
    this.api.changerStatutOffre(off.id, nouveauStatut).subscribe({
      next: () => {
        this.toast.success(`Offre passée à ${nouveauStatut}`);
        this.chargerOffres();
      }
    });
  }

  chargerCandidatures(offreId: number) {
    if (this.selectedOffreId() === offreId) {
      this.selectedOffreId.set(null);
      return;
    }

    this.selectedOffreId.set(offreId);
    this.api.getCandidaturesOffre(offreId).subscribe({
      next: data => this.candidatures.set(data)
    });
  }

  changerStatutCand(candId: number, statut: string) {
    this.api.changerStatutCandidature(candId, statut).subscribe({
      next: () => {
        this.toast.success(`Statut mis à jour : ${statut}`);
        const currentOffreId = this.selectedOffreId();
        if (currentOffreId) this.chargerCandidatures(currentOffreId);
      }
    });
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  creerOffre() {
    this.submitting.set(true);
    this.api.createOffre(this.nouvelleOffre).subscribe({
      next: () => {
        this.submitting.set(false);
        this.showCreateModal = false;
        this.toast.success('Offre publiée avec succès !');
        this.chargerOffres();
      },
      error: (err) => {
        this.submitting.set(false);
        const msg = err.error?.message || 'Erreur lors de la publication de l\'offre.';
        this.toast.error(msg);
      }
    });
  }

  getCandidatureBadgeClass(statut: string): string {
    switch (statut) {
      case 'ACCEPTEE': return 'badge-success';
      case 'REFUSEE': return 'badge-danger';
      case 'VUE': return 'badge-primary';
      default: return 'badge-warning';
    }
  }
}
