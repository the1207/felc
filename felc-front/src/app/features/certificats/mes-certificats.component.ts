import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CertificatResponse } from '../../core/models/models';

@Component({
  selector: 'app-mes-certificats',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="section-py" style="background-color: var(--slate-50); min-height: 85vh;">
      <div class="app-container">
        
        <div style="margin-bottom: 2.5rem; text-align: center; max-width: 650px; margin-left: auto; margin-right: auto;">
          <span class="badge badge-warning" style="margin-bottom: 0.5rem;">Preuve de Compétences</span>
          <h1 style="font-size: 2.25rem; margin-bottom: 0.5rem;">Mes Certificats Officiels FELC</h1>
          <p style="color: var(--slate-600); font-size: 1rem;">
            Chaque certificat est unique, infalsifiable et vérifiable instantanément par les recruteurs du monde entier sans création de compte.
          </p>
        </div>

        <div *ngIf="certificats().length > 0; else noCertsTpl" class="grid grid-cols-1 md:grid-cols-2 gap-8" style="max-width: 950px; margin: 0 auto;">
          <div *ngFor="let cert of certificats()" class="card" style="border: 2px solid var(--amber-200); box-shadow: var(--shadow-lg); background: linear-gradient(180deg, #ffffff 0%, var(--amber-50) 100%);">
            <div class="card-body" style="padding: 2rem;">
              
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
                <div class="cert-seal">
                  <span style="font-size: 1.75rem;">🏅</span>
                </div>
                <div style="text-align: right;">
                  <span class="badge badge-success">CERTIFICAT OFFICIEL</span>
                  <div style="font-family: var(--font-mono); font-weight: 800; font-size: 1.1rem; color: var(--slate-900); margin-top: 0.35rem;">
                    {{ cert.code }}
                  </div>
                </div>
              </div>

              <div style="font-size: 0.8rem; font-weight: 700; color: var(--amber-800); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem;">
                Formation Pratique Certifiée
              </div>
              <h2 style="font-size: 1.4rem; color: var(--slate-900); margin-bottom: 1rem;">
                {{ cert.formationTitre }}
              </h2>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px dashed var(--amber-300); padding-top: 1rem; margin-top: 1.5rem;">
                <div>
                  <div style="font-size: 0.75rem; color: var(--slate-500); text-transform: uppercase; font-weight: 700;">Score d'Excellence</div>
                  <div style="font-size: 1.35rem; font-weight: 800; color: var(--accent-700);">
                    {{ cert.score }} / 100
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 0.75rem; color: var(--slate-500); text-transform: uppercase; font-weight: 700;">Date d'émission</div>
                  <div style="font-size: 0.9rem; font-weight: 600; color: var(--slate-800);">
                    {{ cert.dateEmission | date:'mediumDate' }}
                  </div>
                </div>
              </div>

              <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem;">
                <a [routerLink]="['/certificats/verify']" [queryParams]="{ code: cert.code }" class="btn btn-outline btn-sm" style="flex: 1;">
                  🔍 Tester la vérification publique
                </a>
                <a routerLink="/portfolio/me" class="btn btn-primary btn-sm">
                  💼 Mon Portfolio
                </a>
              </div>

            </div>
          </div>
        </div>

        <ng-template #noCertsTpl>
          <div class="card" style="padding: 4rem 2rem; text-align: center; max-width: 600px; margin: 0 auto;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📜</div>
            <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Aucun certificat obtenu pour le moment</h3>
            <p style="color: var(--slate-600); margin-bottom: 1.5rem;">
              Complétez l'ensemble des exercices pratiques et le projet final d'une formation pour débloquer votre premier certificat.
            </p>
            <a routerLink="/formations" class="btn btn-primary">
              Commencer une formation
            </a>
          </div>
        </ng-template>

      </div>
    </div>
  `
})
export class MesCertificatsComponent implements OnInit {
  private api = inject(ApiService);
  public certificats = signal<CertificatResponse[]>([]);

  ngOnInit() {
    this.api.getMesCertificats().subscribe({
      next: data => this.certificats.set(data),
      error: () => {}
    });
  }
}
