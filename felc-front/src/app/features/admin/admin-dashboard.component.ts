import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { AdminStatsResponse, AdminUserResponse, OffreResponse, DomaineResponse } from '../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="background-color: var(--slate-50); min-height: 85vh;">
      <div class="app-container">
        
        <!-- Header -->
        <div style="margin-bottom: 2.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge badge-danger" style="margin-bottom: 0.5rem;">Administration Centrale</span>
            <h1 style="font-size: 2.25rem; margin-bottom: 0.25rem;">Supervision de la Plateforme FELC</h1>
            <p style="color: var(--slate-600); font-size: 1rem;">
              Métriques en temps réel, gestion des utilisateurs, modération des offres et création de domaines.
            </p>
          </div>
          <button (click)="showNewDomaineModal = true" class="btn btn-primary btn-lg" style="box-shadow: var(--shadow-glow);">
            ➕ Nouveau Domaine Métier
          </button>
        </div>

        <!-- Metric Stat Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6" style="margin-bottom: 3rem;" *ngIf="stats() as s">
          <div class="card" style="border-left: 4px solid var(--primary-600);">
            <div class="card-body">
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">Total Utilisateurs</div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--slate-900); margin: 0.35rem 0;">{{ s.totalUsers }}</div>
              <div style="font-size: 0.75rem; color: var(--slate-500);">
                🎓 {{ s.totalApprenants }} Appr. • 👨‍🏫 {{ s.totalFormateurs }} Form. • 🏢 {{ s.totalEntreprises }} Entr.
              </div>
            </div>
          </div>

          <div class="card" style="border-left: 4px solid var(--accent-500);">
            <div class="card-body">
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">Formations & Soumissions</div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--accent-700); margin: 0.35rem 0;">{{ s.totalFormations }}</div>
              <div style="font-size: 0.75rem; color: var(--slate-500);">
                💻 {{ s.totalSoumissions }} soumissions de code évaluées
              </div>
            </div>
          </div>

          <div class="card" style="border-left: 4px solid var(--amber-500);">
            <div class="card-body">
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">Certificats Délivrés</div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--amber-600); margin: 0.35rem 0;">{{ s.totalCertificats }}</div>
              <div style="font-size: 0.75rem; color: var(--slate-500);">
                📜 Codes infalsifiables vérifiés
              </div>
            </div>
          </div>

          <div class="card" style="border-left: 4px solid #8b5cf6;">
            <div class="card-body">
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">Offres & Candidatures</div>
              <div style="font-size: 2rem; font-weight: 800; color: #7c3aed; margin: 0.35rem 0;">{{ s.totalOffres }}</div>
              <div style="font-size: 0.75rem; color: var(--slate-500);">
                📩 {{ s.totalCandidatures }} candidatures enregistrées
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs for Admin Views -->
        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 2px solid var(--slate-200);">
          <button 
            (click)="activeTab = 'users'"
            [style.color]="activeTab === 'users' ? 'var(--primary-600)' : 'var(--slate-500)'"
            [style.border-bottom]="activeTab === 'users' ? '3px solid var(--primary-600)' : 'none'"
            style="background: none; border: none; font-weight: 700; font-size: 1rem; padding: 0.75rem 1rem; cursor: pointer;"
          >
            👥 Gestion des Utilisateurs ({{ users().length }})
          </button>
          <button 
            (click)="activeTab = 'offres'"
            [style.color]="activeTab === 'offres' ? 'var(--primary-600)' : 'var(--slate-500)'"
            [style.border-bottom]="activeTab === 'offres' ? '3px solid var(--primary-600)' : 'none'"
            style="background: none; border: none; font-weight: 700; font-size: 1rem; padding: 0.75rem 1rem; cursor: pointer;"
          >
            💼 Modération des Offres ({{ offres().length }})
          </button>
        </div>

        <!-- Tab 1: Users -->
        <div *ngIf="activeTab === 'users'" class="card">
          <div class="card-body" style="padding: 0;">
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                <thead>
                  <tr style="border-bottom: 2px solid var(--slate-200); background: var(--slate-50); color: var(--slate-600); font-weight: 700;">
                    <th style="padding: 0.85rem 1.25rem;">Nom & Prénom</th>
                    <th style="padding: 0.85rem 1.25rem;">Email</th>
                    <th style="padding: 0.85rem 1.25rem;">Rôle</th>
                    <th style="padding: 0.85rem 1.25rem;">Date Inscription</th>
                    <th style="padding: 0.85rem 1.25rem;">Statut</th>
                    <th style="padding: 0.85rem 1.25rem; text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let u of users()" style="border-bottom: 1px solid var(--slate-100);">
                    <td style="padding: 1rem 1.25rem; font-weight: 700; color: var(--slate-900);">
                      {{ u.prenom }} {{ u.nom }}
                    </td>
                    <td style="padding: 1rem 1.25rem; color: var(--slate-600);">
                      {{ u.email }}
                    </td>
                    <td style="padding: 1rem 1.25rem;">
                      <span class="badge" [ngClass]="getRoleBadgeClass(u.role)">
                        {{ u.role }}
                      </span>
                    </td>
                    <td style="padding: 1rem 1.25rem; color: var(--slate-500); font-size: 0.825rem;">
                      {{ u.dateInscription | date:'shortDate' }}
                    </td>
                    <td style="padding: 1rem 1.25rem;">
                      <span class="badge" [ngClass]="u.actif ? 'badge-success' : 'badge-danger'">
                        {{ u.actif ? 'ACTIF' : 'DÉSACTIVÉ' }}
                      </span>
                    </td>
                    <td style="padding: 1rem 1.25rem; text-align: right;">
                      <button 
                        (click)="toggleActivation(u)" 
                        class="btn btn-sm"
                        [ngClass]="u.actif ? 'btn-danger' : 'btn-accent'"
                        [disabled]="u.role === 'ADMIN'"
                      >
                        {{ u.actif ? 'Bloquer' : 'Activer' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Tab 2: Offres -->
        <div *ngIf="activeTab === 'offres'" class="card">
          <div class="card-body" style="padding: 0;">
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                <thead>
                  <tr style="border-bottom: 2px solid var(--slate-200); background: var(--slate-50); color: var(--slate-600); font-weight: 700;">
                    <th style="padding: 0.85rem 1.25rem;">Titre</th>
                    <th style="padding: 0.85rem 1.25rem;">Entreprise</th>
                    <th style="padding: 0.85rem 1.25rem;">Type</th>
                    <th style="padding: 0.85rem 1.25rem;">Budget</th>
                    <th style="padding: 0.85rem 1.25rem;">Statut</th>
                    <th style="padding: 0.85rem 1.25rem; text-align: right;">Modération</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let off of offres()" style="border-bottom: 1px solid var(--slate-100);">
                    <td style="padding: 1rem 1.25rem; font-weight: 700; color: var(--slate-900);">
                      {{ off.titre }}
                    </td>
                    <td style="padding: 1rem 1.25rem; color: var(--slate-600);">
                      {{ off.entrepriseNom }}
                    </td>
                    <td style="padding: 1rem 1.25rem;">
                      <span class="badge badge-primary">{{ off.type }}</span>
                    </td>
                    <td style="padding: 1rem 1.25rem; font-weight: 700;">
                      {{ off.budget | number }} FCFA
                    </td>
                    <td style="padding: 1rem 1.25rem;">
                      <span class="badge" [ngClass]="off.statut === 'OUVERTE' ? 'badge-success' : 'badge-danger'">
                        {{ off.statut }}
                      </span>
                    </td>
                    <td style="padding: 1rem 1.25rem; text-align: right;">
                      <button (click)="toggleOffreStatut(off)" class="btn btn-outline btn-sm">
                        {{ off.statut === 'OUVERTE' ? '🔒 Fermer' : '🔓 Rouvrir' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Create Domaine Modal -->
    <div *ngIf="showNewDomaineModal" class="modal-overlay">
      <div class="modal-content" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.35rem; margin: 0;">Créer un nouveau Domaine Métier</h3>
          <button (click)="showNewDomaineModal = false" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        </div>

        <form (ngSubmit)="creerDomaine()">
          <div class="form-group">
            <label class="form-label">Nom du Domaine (ex: Informatique & Web, Agriculture Intelligente)</label>
            <input type="text" name="nom" [(ngModel)]="nouveauDomaine.nom" required class="form-input">
          </div>

          <div class="form-group">
            <label class="form-label">Code Court (2 à 6 caractères, ex: INFO, AGRI, MKT, ENER)</label>
            <input type="text" name="code" [(ngModel)]="nouveauDomaine.code" required maxlength="6" class="form-input" style="text-transform: uppercase; font-family: var(--font-mono);">
          </div>

          <div class="form-group">
            <label class="form-label">Description du secteur</label>
            <textarea name="description" [(ngModel)]="nouveauDomaine.description" class="form-textarea"></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" (click)="showNewDomaineModal = false" class="btn btn-outline">Annuler</button>
            <button type="submit" [disabled]="submittingDomaine()" class="btn btn-primary">
              <span *ngIf="submittingDomaine()" class="spinner"></span>
              <span *ngIf="!submittingDomaine()">Enregistrer le domaine</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  public stats = signal<AdminStatsResponse | null>(null);
  public users = signal<AdminUserResponse[]>([]);
  public offres = signal<OffreResponse[]>([]);
  public activeTab: 'users' | 'offres' = 'users';

  // New Domaine Modal
  public showNewDomaineModal = false;
  public submittingDomaine = signal(false);
  public nouveauDomaine = {
    nom: '',
    code: '',
    description: ''
  };

  ngOnInit() {
    this.chargerDonnees();
  }

  chargerDonnees() {
    this.api.getAdminStats().subscribe({
      next: data => this.stats.set(data)
    });

    this.api.getAdminUsers().subscribe({
      next: data => this.users.set(data)
    });

    this.api.getAdminOffres().subscribe({
      next: data => this.offres.set(data)
    });
  }

  toggleActivation(u: AdminUserResponse) {
    const nouveauStatut = !u.actif;
    this.api.changerActivationUser(u.id, nouveauStatut).subscribe({
      next: () => {
        this.toast.success(`Utilisateur ${u.email} ${nouveauStatut ? 'activé' : 'désactivé'}.`);
        this.chargerDonnees();
      },
      error: () => this.toast.error('Erreur lors du changement de statut.')
    });
  }

  toggleOffreStatut(off: OffreResponse) {
    const nouveauStatut = off.statut === 'OUVERTE' ? 'FERMEE' : 'OUVERTE';
    this.api.changerStatutOffre(off.id, nouveauStatut).subscribe({
      next: () => {
        this.toast.success(`Offre passée à ${nouveauStatut}`);
        this.chargerDonnees();
      }
    });
  }

  creerDomaine() {
    if (!this.nouveauDomaine.nom || !this.nouveauDomaine.code) {
      this.toast.error('Veuillez renseigner le nom et le code du domaine.');
      return;
    }

    this.submittingDomaine.set(true);
    this.api.createDomaine(this.nouveauDomaine).subscribe({
      next: () => {
        this.submittingDomaine.set(false);
        this.showNewDomaineModal = false;
        this.toast.success('Domaine créé avec succès !');
        this.nouveauDomaine = { nom: '', code: '', description: '' };
        this.chargerDonnees();
      },
      error: (err) => {
        this.submittingDomaine.set(false);
        const msg = err.error?.message || 'Erreur lors de la création du domaine.';
        this.toast.error(msg);
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN': return 'badge-danger';
      case 'FORMATEUR': return 'badge-purple';
      case 'ENTREPRISE': return 'badge-warning';
      default: return 'badge-success';
    }
  }
}
