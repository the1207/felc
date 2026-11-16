import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { OffreResponse, DomaineResponse, TypeOffre } from '../../core/models/models';

@Component({
  selector: 'app-offre-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="background-color: var(--slate-50); min-height: 85vh;">
      <div class="app-container">
        
        <!-- Header -->
        <div style="margin-bottom: 2.5rem;">
          <span class="badge badge-warning" style="margin-bottom: 0.5rem;">Opportunités Professionnelles</span>
          <h1 style="font-size: 2.35rem; margin-bottom: 0.5rem;">Offres d'Emploi & Missions Freelance</h1>
          <p style="color: var(--slate-600); font-size: 1.05rem;">
            Trouvez des opportunités concrètes publiées par des entreprises togolaises et régionales qui valorisent vos projets pratiques.
          </p>
        </div>

        <!-- Filter Card -->
        <div class="card" style="margin-bottom: 2.5rem; padding: 1.25rem;">
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;" class="md:grid-cols-3">
              <div>
                <input 
                  type="text" 
                  [(ngModel)]="searchQuery" 
                  placeholder="🔍 Rechercher (ex: Développeur, Lomé...)" 
                  class="form-input"
                >
              </div>

              <div>
                <select [(ngModel)]="selectedType" class="form-select">
                  <option value="">Tous types (Emploi & Freelance)</option>
                  <option value="EMPLOI">💼 Emploi (CDI, CDD, Stage)</option>
                  <option value="MISSION">⚡ Mission Freelance</option>
                </select>
              </div>

              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <input 
                  type="checkbox" 
                  id="remoteOnly" 
                  [(ngModel)]="remoteOnly"
                  style="width: 1.25rem; height: 1.25rem; accent-color: var(--primary-600); cursor: pointer;"
                >
                <label for="remoteOnly" style="font-size: 0.9rem; font-weight: 600; color: var(--slate-700); cursor: pointer;">
                  🌐 Télétravail autorisé uniquement
                </label>
              </div>
            </div>

            <!-- Domaine filter buttons -->
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">Filière :</span>
              <button 
                (click)="selectedDomaineId = null" 
                class="badge" 
                [ngClass]="selectedDomaineId === null ? 'badge-primary' : 'badge-slate'"
                style="cursor: pointer; border: none; padding: 0.35rem 0.75rem;"
              >
                Toutes
              </button>
              <button 
                *ngFor="let dom of domaines()" 
                (click)="selectedDomaineId = dom.id" 
                class="badge" 
                [ngClass]="selectedDomaineId === dom.id ? 'badge-primary' : 'badge-slate'"
                style="cursor: pointer; border: none; padding: 0.35rem 0.75rem;"
              >
                {{ dom.nom }}
              </button>
            </div>

          </div>
        </div>

        <!-- Offres Grid -->
        <div *ngIf="filteredOffres().length > 0; else noOffresTpl" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let off of filteredOffres()" class="card card-hover" style="display: flex; flex-direction: column;">
            <div class="card-body" style="display: flex; flex-direction: column; height: 100%;">
              
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <span class="badge" [ngClass]="off.type === 'MISSION' ? 'badge-purple' : 'badge-primary'">
                  {{ off.type }}
                </span>
                <span *ngIf="off.remote" class="badge badge-success">🌐 Télétravail</span>
              </div>

              <h2 style="font-size: 1.25rem; margin-bottom: 0.35rem; color: var(--slate-900);">
                {{ off.titre }}
              </h2>

              <div style="font-size: 0.875rem; font-weight: 600; color: var(--primary-600); margin-bottom: 0.75rem;">
                🏢 {{ off.entrepriseNom }} • 📍 {{ off.localisation }}
              </div>

              <p style="color: var(--slate-600); font-size: 0.875rem; line-height: 1.5; margin-bottom: 1.25rem; flex: 1;">
                {{ off.description.slice(0, 120) }}...
              </p>

              <div style="background: var(--slate-50); border-radius: var(--radius-md); padding: 0.6rem 0.8rem; margin-bottom: 1rem; display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--slate-600);">
                <span>Expérience : <strong>{{ off.experienceMin }} an(s)</strong></span>
                <span>Filière : <strong>{{ off.domaineNom }}</strong></span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--slate-100); padding-top: 0.85rem; margin-top: auto;">
                <div>
                  <div style="font-size: 0.7rem; color: var(--slate-400); text-transform: uppercase; font-weight: 700;">Rémunération / Budget</div>
                  <div style="font-weight: 800; color: var(--slate-900); font-size: 1.05rem;">
                    {{ off.budget | number }} FCFA
                  </div>
                </div>
                <a [routerLink]="['/offres', off.id]" class="btn btn-primary btn-sm">
                  Voir l'offre →
                </a>
              </div>

            </div>
          </div>
        </div>

        <ng-template #noOffresTpl>
          <div class="card" style="padding: 4rem 2rem; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">💼</div>
            <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Aucune offre ne correspond à vos filtres</h3>
            <p style="color: var(--slate-500); margin-bottom: 1.5rem;">
              Modifiez vos critères pour afficher d'autres opportunités.
            </p>
            <button (click)="resetFilters()" class="btn btn-outline">
              Réinitialiser
            </button>
          </div>
        </ng-template>

      </div>
    </div>
  `
})
export class OffreListComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  public allOffres = signal<OffreResponse[]>([]);
  public domaines = signal<DomaineResponse[]>([]);

  public searchQuery = '';
  public selectedType = '';
  public selectedDomaineId: number | null = null;
  public remoteOnly = false;

  public filteredOffres = computed(() => {
    let list = this.allOffres();

    if (this.selectedType) {
      list = list.filter(o => o.type === this.selectedType);
    }

    if (this.selectedDomaineId) {
      list = list.filter(o => o.domaineId === this.selectedDomaineId);
    }

    if (this.remoteOnly) {
      list = list.filter(o => o.remote === true);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(o => 
        o.titre.toLowerCase().includes(q) || 
        o.description.toLowerCase().includes(q) ||
        o.entrepriseNom.toLowerCase().includes(q) ||
        o.localisation.toLowerCase().includes(q)
      );
    }

    return list;
  });

  ngOnInit() {
    this.api.getOffres().subscribe({
      next: data => this.allOffres.set(data),
      error: () => {}
    });

    this.api.getDomaines().subscribe({
      next: data => this.domaines.set(data),
      error: () => {}
    });

    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.selectedType = params['type'];
      }
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedType = '';
    this.selectedDomaineId = null;
    this.remoteOnly = false;
  }
}
