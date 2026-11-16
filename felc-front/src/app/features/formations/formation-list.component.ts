import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { FormationResponse, DomaineResponse } from '../../core/models/models';

@Component({
  selector: 'app-formation-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="background-color: var(--slate-50); min-height: 85vh;">
      <div class="app-container">
        
        <!-- Header -->
        <div style="margin-bottom: 2.5rem;">
          <span class="badge badge-primary" style="margin-bottom: 0.5rem;">100% Pratique & Projets</span>
          <h1 style="font-size: 2.35rem; margin-bottom: 0.5rem;">Catalogue des Formations Pratiques</h1>
          <p style="color: var(--slate-600); font-size: 1.05rem;">
            Acquérez des compétences recherchées par les entreprises à travers des projets réels évalués par l'IA et des mentors.
          </p>
        </div>

        <!-- Filter Controls -->
        <div class="card" style="margin-bottom: 2.5rem; padding: 1.25rem;">
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            
            <!-- Search & Level Row -->
            <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;" class="md:grid-cols-2">
              <div>
                <input 
                  type="text" 
                  [(ngModel)]="searchQuery" 
                  placeholder="🔍 Rechercher une formation (ex: Spring Boot, Angular, E-commerce...)" 
                  class="form-input"
                >
              </div>
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <label style="font-size: 0.85rem; font-weight: 600; color: var(--slate-600); white-space: nowrap;">Niveau :</label>
                <select [(ngModel)]="selectedNiveau" class="form-select">
                  <option value="">Tous les niveaux</option>
                  <option value="DEBUTANT">Débutant</option>
                  <option value="INTERMEDIAIRE">Intermédiaire</option>
                  <option value="AVANCE">Avancé</option>
                </select>
              </div>
            </div>

            <!-- Domaine Filter Pills -->
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">Filière :</span>
              <button 
                (click)="selectedDomaineId = null" 
                class="badge" 
                [ngClass]="selectedDomaineId === null ? 'badge-primary' : 'badge-slate'"
                style="cursor: pointer; border: none; padding: 0.4rem 0.85rem; font-size: 0.8rem;"
              >
                Toutes les filières
              </button>
              <button 
                *ngFor="let dom of domaines()" 
                (click)="selectedDomaineId = dom.id" 
                class="badge" 
                [ngClass]="selectedDomaineId === dom.id ? 'badge-primary' : 'badge-slate'"
                style="cursor: pointer; border: none; padding: 0.4rem 0.85rem; font-size: 0.8rem;"
              >
                {{ dom.nom }}
              </button>
            </div>

          </div>
        </div>

        <!-- Formations List Grid -->
        <div *ngIf="filteredFormations().length > 0; else noFormationsTpl" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let form of filteredFormations()" class="card card-hover" style="display: flex; flex-direction: column;">
            <div class="card-body" style="display: flex; flex-direction: column; height: 100%;">
              
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                <span class="badge badge-primary">{{ form.domaineCode || 'TECH' }}</span>
                <span class="badge" [ngClass]="getNiveauBadgeClass(form.niveau)">
                  {{ form.niveau }}
                </span>
              </div>

              <h2 style="font-size: 1.25rem; margin-bottom: 0.6rem; color: var(--slate-900);">
                {{ form.titre }}
              </h2>

              <p style="color: var(--slate-600); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem; flex: 1;">
                {{ form.description }}
              </p>

              <div style="border-top: 1px solid var(--slate-100); padding-top: 1rem; margin-top: auto; display: flex; align-items: center; justify-content: space-between;">
                <div style="font-size: 0.8rem; color: var(--slate-500);">
                  👨‍🏫 {{ form.formateurPrenom }} {{ form.formateurNom }}
                </div>
                <a [routerLink]="['/formations', form.id]" class="btn btn-primary btn-sm">
                  Voir le programme →
                </a>
              </div>

            </div>
          </div>
        </div>

        <ng-template #noFormationsTpl>
          <div class="card" style="padding: 4rem 2rem; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">Aucune formation ne correspond à vos filtres</h3>
            <p style="color: var(--slate-500); margin-bottom: 1.5rem;">
              Essayez de réinitialiser vos critères de recherche.
            </p>
            <button (click)="resetFilters()" class="btn btn-outline">
              Réinitialiser les filtres
            </button>
          </div>
        </ng-template>

      </div>
    </div>
  `
})
export class FormationListComponent implements OnInit {
  private api = inject(ApiService);

  public allFormations = signal<FormationResponse[]>([]);
  public domaines = signal<DomaineResponse[]>([]);

  public searchQuery = '';
  public selectedNiveau = '';
  public selectedDomaineId: number | null = null;

  public filteredFormations = computed(() => {
    let list = this.allFormations();

    if (this.selectedDomaineId) {
      list = list.filter(f => f.domaineId === this.selectedDomaineId);
    }

    if (this.selectedNiveau) {
      list = list.filter(f => f.niveau === this.selectedNiveau);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(f => 
        f.titre.toLowerCase().includes(q) || 
        f.description.toLowerCase().includes(q)
      );
    }

    return list;
  });

  ngOnInit() {
    this.api.getFormations().subscribe({
      next: data => this.allFormations.set(data),
      error: () => {}
    });

    this.api.getDomaines().subscribe({
      next: data => this.domaines.set(data),
      error: () => {}
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedNiveau = '';
    this.selectedDomaineId = null;
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
