import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { DomaineResponse, OrientationResponse } from '../../core/models/models';

@Component({
  selector: 'app-orientation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="background: linear-gradient(135deg, var(--slate-100) 0%, var(--primary-50) 100%); min-height: 85vh;">
      <div class="app-container" style="max-width: 900px;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 3rem;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.85rem; border-radius: var(--radius-full); background: var(--primary-100); color: var(--primary-800); font-size: 0.825rem; font-weight: 700; margin-bottom: 1rem;">
            <span>✨</span> Moteur d'Orientation Intelligent & Anti-Hallucination
          </div>
          <h1 style="font-size: 2.35rem; margin-bottom: 0.75rem;">Trouvez votre parcours d'insertion sur-mesure</h1>
          <p style="color: var(--slate-600); font-size: 1.05rem; max-width: 650px; margin: 0 auto;">
            Notre IA analyse vos compétences actuelles, vos ambitions et le marché de l'emploi pour vous conseiller un parcours d'apprentissage 100% pratique ancré dans notre catalogue réel.
          </p>
        </div>

        <!-- Form Card if no result yet -->
        <div *ngIf="!result() && !loading()" class="card" style="box-shadow: var(--shadow-xl);">
          <div class="card-body" style="padding: 2.5rem;">
            
            <form (ngSubmit)="lancerDiagnostic()">
              
              <!-- Domaine Selector -->
              <div class="form-group">
                <label class="form-label">Domaine de prédilection</label>
                <select name="domaineId" [(ngModel)]="domaineId" class="form-select" required>
                  <option [ngValue]="null" disabled selected>-- Sélectionnez votre filière --</option>
                  <option *ngFor="let dom of domaines()" [ngValue]="dom.id">
                    {{ dom.nom }} ({{ dom.code }})
                  </option>
                </select>
                <div style="font-size: 0.78rem; color: var(--slate-500); margin-top: 0.3rem;">
                  FELC couvre le développement web, l'IA, le marketing digital, l'agriculture et bien d'autres métiers.
                </div>
              </div>

              <!-- Current Level -->
              <div class="form-group">
                <label class="form-label">Niveau d'expérience actuel</label>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
                  <button 
                    type="button" 
                    (click)="niveauActuel = 'DEBUTANT'"
                    [class.btn-primary]="niveauActuel === 'DEBUTANT'"
                    [class.btn-outline]="niveauActuel !== 'DEBUTANT'"
                    class="btn"
                  >
                    🌱 Débutant
                  </button>
                  <button 
                    type="button" 
                    (click)="niveauActuel = 'INTERMEDIAIRE'"
                    [class.btn-primary]="niveauActuel === 'INTERMEDIAIRE'"
                    [class.btn-outline]="niveauActuel !== 'INTERMEDIAIRE'"
                    class="btn"
                  >
                    🚀 Intermédiaire
                  </button>
                  <button 
                    type="button" 
                    (click)="niveauActuel = 'AVANCE'"
                    [class.btn-primary]="niveauActuel === 'AVANCE'"
                    [class.btn-outline]="niveauActuel !== 'AVANCE'"
                    class="btn"
                  >
                    ⭐ Avancé
                  </button>
                </div>
              </div>

              <!-- Career Objectives -->
              <div class="form-group">
                <label class="form-label">Vos objectifs professionnels & métiers visés</label>
                <textarea 
                  name="objectifs" 
                  [(ngModel)]="objectifs" 
                  class="form-textarea" 
                  required
                  placeholder="Ex : Je souhaite maîtriser Spring Boot et Angular pour créer des applications web d'entreprise, puis trouver une mission freelance ou un poste de développeur junior à Lomé."
                ></textarea>
              </div>

              <!-- Hours Available -->
              <div class="form-group">
                <label class="form-label">Temps disponible par semaine : <strong>{{ tempsDisponible }} heures</strong></label>
                <input 
                  type="range" 
                  name="tempsDisponible" 
                  [(ngModel)]="tempsDisponible" 
                  min="5" 
                  max="40" 
                  step="5"
                  style="width: 100%; accent-color: var(--primary-600); cursor: pointer;"
                >
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--slate-500); margin-top: 0.25rem;">
                  <span>5h (Études en parallèle)</span>
                  <span>20h (Temps partiel)</span>
                  <span>40h (Temps plein intensif)</span>
                </div>
              </div>

              <div style="margin-top: 2rem;">
                <button 
                  type="submit" 
                  class="btn btn-accent btn-lg" 
                  style="width: 100%; font-size: 1.1rem; box-shadow: var(--shadow-emerald-glow);"
                >
                  ✨ Générer mon orientation personnalisée
                </button>
              </div>

            </form>

          </div>
        </div>

        <!-- Loading State with Steps Animation -->
        <div *ngIf="loading()" class="card" style="padding: 4rem 2rem; text-align: center; box-shadow: var(--shadow-xl);">
          <div style="margin-bottom: 2rem;">
            <div class="spinner spinner-primary" style="width: 3.5rem; height: 3.5rem; border-width: 4px;"></div>
          </div>
          <h2 style="font-size: 1.6rem; margin-bottom: 0.75rem;">L'Intelligence Artificielle évalue votre profil...</h2>
          <p style="color: var(--slate-600); font-size: 0.95rem; max-width: 500px; margin: 0 auto 2rem auto;">
            Croisement des compétences cibles, vérification du catalogue réel des cours FELC et des offres du marché.
          </p>

          <div style="max-width: 420px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.75rem; text-align: left; font-size: 0.9rem; color: var(--slate-700);">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span>✅</span> Analyse de vos objectifs déclarés
            </div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span>⚡</span> Filtre anti-hallucination sur les formations disponibles
            </div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span>💼</span> Identification des débouchés et opportunités en FCFA
            </div>
          </div>
        </div>

        <!-- Result View -->
        <div *ngIf="result()" style="display: flex; flex-direction: column; gap: 2rem;">
          
          <!-- Top Card: Diagnostic & Summary -->
          <div class="card" style="border-left: 6px solid var(--accent-500); box-shadow: var(--shadow-xl);">
            <div class="card-body">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                <span class="badge badge-success" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">
                  Niveau Estimé : {{ result()?.niveauEstime }}
                </span>
                <span style="font-size: 0.875rem; font-weight: 700; color: var(--slate-600);">
                  ⏱️ Durée estimée : ~{{ result()?.dureeEstimeeSemaines }} semaines
                </span>
              </div>

              <h2 style="font-size: 1.5rem; margin-bottom: 0.75rem;">Synthèse de votre Diagnostic</h2>
              <p style="color: var(--slate-700); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
                {{ result()?.resumeDiagnostic }}
              </p>

              <!-- Competences Cibles -->
              <div>
                <div style="font-size: 0.825rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase; margin-bottom: 0.5rem;">
                  Compétences clés à acquérir :
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                  <span *ngFor="let comp of result()?.competencesCibles" class="badge badge-primary" style="font-size: 0.8rem; padding: 0.35rem 0.65rem;">
                    {{ comp }}
                  </span>
                </div>
              </div>

            </div>
          </div>

          <!-- Recommended Formations (Real Catalog Guaranteed!) -->
          <div class="card">
            <div class="card-header">
              <div style="font-weight: 700; font-size: 1.15rem; color: var(--slate-900);">
                🎓 Parcours de Formations Recommandées (Catalogue Réel)
              </div>
              <span class="badge badge-primary">Anti-Hallucination</span>
            </div>
            <div class="card-body">
              <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                <div *ngFor="let form of result()?.formationsRecommandees; let idx = index" style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem; border-radius: var(--radius-xl); background: var(--slate-50); border: 1px solid var(--slate-200); flex-wrap: wrap; gap: 1rem;">
                  <div style="display: flex; align-items: center; gap: 1rem; flex: 1; min-width: 250px;">
                    <div style="width: 2.5rem; height: 2.5rem; border-radius: 50%; background: var(--primary-600); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem;">
                      {{ idx + 1 }}
                    </div>
                    <div>
                      <h4 style="font-size: 1.1rem; margin-bottom: 0.2rem;">{{ form.titre }}</h4>
                      <p style="font-size: 0.85rem; color: var(--slate-600);">{{ form.description }}</p>
                      <span class="badge badge-slate" style="margin-top: 0.4rem;">Niveau {{ form.niveau }}</span>
                    </div>
                  </div>
                  <div>
                    <a [routerLink]="['/formations', form.id]" class="btn btn-primary btn-sm">
                      Rejoindre cette formation →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Suggested Projects -->
          <div class="card" *ngIf="result()?.projetsSuggerees?.length">
            <div class="card-header">
              <div style="font-weight: 700; font-size: 1.15rem; color: var(--slate-900);">
                💡 Projets Porteurs à Réaliser pour votre Portfolio
              </div>
            </div>
            <div class="card-body">
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem;">
                <li *ngFor="let proj of result()?.projetsSuggerees" style="display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.925rem; color: var(--slate-700);">
                  <span style="color: var(--accent-600); font-weight: 700; font-size: 1.1rem;">➔</span>
                  <span>{{ proj }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Job Opportunities -->
          <div class="card" *ngIf="result()?.opportunitesMarche?.length">
            <div class="card-header" style="background: var(--amber-50); border-bottom-color: var(--amber-200);">
              <div style="font-weight: 700; font-size: 1.15rem; color: var(--amber-900);">
                💼 Débouchés Immédiats : Offres Ouvertes dans votre Filière
              </div>
            </div>
            <div class="card-body">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div *ngFor="let off of result()?.opportunitesMarche" style="border: 1px solid var(--slate-200); border-radius: var(--radius-lg); padding: 1.25rem; background: #ffffff;">
                  <span class="badge badge-warning" style="margin-bottom: 0.5rem;">{{ off.type }}</span>
                  <h4 style="font-size: 1.05rem; margin-bottom: 0.25rem;">{{ off.titre }}</h4>
                  <div style="font-size: 0.825rem; color: var(--slate-500); margin-bottom: 0.75rem;">
                    🏢 {{ off.entrepriseNom }} • 📍 {{ off.localisation }}
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--slate-100); padding-top: 0.75rem;">
                    <strong style="color: var(--slate-900);">{{ off.budget | number }} FCFA</strong>
                    <a [routerLink]="['/offres', off.id]" class="btn btn-outline btn-sm">
                      Consulter l'offre
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reset Button -->
          <div style="text-align: center; margin-top: 1rem;">
            <button (click)="result.set(null)" class="btn btn-outline">
              🔄 Effectuer un nouveau diagnostic
            </button>
          </div>

        </div>

      </div>
    </div>
  `
})
export class OrientationComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  public domaines = signal<DomaineResponse[]>([]);
  public domaineId: number | null = null;
  public niveauActuel = 'DEBUTANT';
  public objectifs = '';
  public tempsDisponible = 15;

  public loading = signal(false);
  public result = signal<OrientationResponse | null>(null);

  ngOnInit() {
    this.api.getDomaines().subscribe({
      next: data => {
        this.domaines.set(data);
        if (data.length > 0) {
          this.domaineId = data[0].id;
        }
      },
      error: () => {}
    });
  }

  lancerDiagnostic() {
    if (!this.auth.isLoggedIn()) {
      this.toast.info('Veuillez vous connecter pour enregistrer votre profil et lancer le diagnostic.');
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/orientation' } });
      return;
    }

    if (!this.domaineId || !this.objectifs) {
      this.toast.error('Veuillez sélectionner un domaine et préciser vos objectifs.');
      return;
    }

    this.loading.set(true);
    this.api.orienterProfil({
      domaineId: this.domaineId,
      niveauActuel: this.niveauActuel,
      objectifs: this.objectifs,
      tempsDisponibleHeuresParSemaine: this.tempsDisponible
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.result.set(res);
        this.toast.success('Orientation calculée avec succès !');
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err.error?.message || 'Erreur lors du calcul de votre orientation IA.';
        this.toast.error(msg);
      }
    });
  }
}
