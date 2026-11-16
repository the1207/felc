import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { CertificatVerificationResponse } from '../../core/models/models';

@Component({
  selector: 'app-verify-certificat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="background: linear-gradient(135deg, var(--slate-100), var(--primary-50)); min-height: 85vh;">
      <div class="app-container" style="max-width: 680px;">
        
        <div style="text-align: center; margin-bottom: 2.5rem;">
          <div style="width: 3.5rem; height: 3.5rem; border-radius: var(--radius-2xl); background: var(--accent-500); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto 1rem auto; box-shadow: var(--shadow-emerald-glow);">
            🛡️
          </div>
          <h1 style="font-size: 2.25rem; margin-bottom: 0.5rem;">Vérification Publique de Certificat</h1>
          <p style="color: var(--slate-600); font-size: 1rem;">
            Vérifiez l'authenticité d'un diplôme FELC en temps réel. Accessible librement par tout recruteur ou entreprise.
          </p>
        </div>

        <!-- Verification Search Card -->
        <div class="card" style="box-shadow: var(--shadow-lg); margin-bottom: 2rem;">
          <div class="card-body" style="padding: 2rem;">
            <form (ngSubmit)="verifier()">
              <label class="form-label" style="font-size: 0.95rem;">Entrez le code unique du certificat :</label>
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <input 
                  type="text" 
                  name="code" 
                  [(ngModel)]="code" 
                  required 
                  placeholder="Ex : FELC-INFO-000001" 
                  class="form-input"
                  style="font-family: var(--font-mono); font-size: 1.05rem; letter-spacing: 0.05em; text-transform: uppercase; flex: 1; min-width: 220px;"
                >
                <button type="submit" [disabled]="loading()" class="btn btn-primary" style="padding: 0.75rem 1.5rem;">
                  <span *ngIf="loading()" class="spinner"></span>
                  <span *ngIf="!loading()">🔍 Vérifier</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Verification Result: Valid -->
        <div *ngIf="result() && result()?.valide" class="card" style="border: 2px solid var(--accent-400); box-shadow: var(--shadow-xl); background: #ffffff;">
          <div class="card-body" style="padding: 2.5rem; text-align: center;">
            
            <div style="width: 4rem; height: 4rem; border-radius: 50%; background: var(--accent-100); color: var(--accent-600); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1rem auto;">
              ✓
            </div>

            <span class="badge badge-success" style="font-size: 0.9rem; padding: 0.4rem 1rem; margin-bottom: 1.25rem;">
              CERTIFICAT AUTHENTIQUE & VALIDE
            </span>

            <div style="font-family: var(--font-mono); font-size: 1.2rem; font-weight: 800; color: var(--slate-900); margin-bottom: 1.5rem;">
              {{ result()?.code }}
            </div>

            <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-xl); padding: 1.5rem; text-align: left; display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">Titulaire du certificat</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: var(--slate-900);">
                  {{ result()?.apprenantPrenom }} {{ result()?.apprenantNom }}
                </div>
              </div>

              <div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">Formation pratique validée</div>
                <div style="font-size: 1.1rem; font-weight: 700; color: var(--primary-700);">
                  {{ result()?.formationTitre }}
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px dashed var(--slate-200); padding-top: 1rem;">
                <div>
                  <div style="font-size: 0.75rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">Score obtenu</div>
                  <div style="font-size: 1.35rem; font-weight: 800; color: var(--accent-600);">
                    {{ result()?.score }} / 100
                  </div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">Date de délivrance</div>
                  <div style="font-size: 1rem; font-weight: 600; color: var(--slate-800); margin-top: 0.2rem;">
                    {{ result()?.dateEmission | date:'longDate' }}
                  </div>
                </div>
              </div>
            </div>

            <div style="font-size: 0.8rem; color: var(--slate-500);">
              Ce certificat atteste que le titulaire a complété avec succès l'ensemble des exercices pratiques et le projet certifiant avec évaluation de code source.
            </div>

          </div>
        </div>

        <!-- Verification Result: Not Found -->
        <div *ngIf="errorState()" class="card" style="border: 2px solid var(--danger-500); box-shadow: var(--shadow-lg); background: #ffffff;">
          <div class="card-body" style="padding: 2.5rem; text-align: center;">
            <div style="width: 4rem; height: 4rem; border-radius: 50%; background: var(--danger-50); color: var(--danger-500); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1rem auto;">
              ✕
            </div>
            <span class="badge badge-danger" style="font-size: 0.9rem; padding: 0.4rem 1rem; margin-bottom: 1rem;">
              CERTIFICAT INTROUVABLE OU INVALIDE
            </span>
            <p style="color: var(--slate-600); font-size: 0.95rem; margin-top: 0.75rem;">
              Aucun certificat ne correspond au code <strong>"{{ lastSearchedCode }}"</strong> dans notre registre officiel. Veuillez vérifier la saisie.
            </p>
          </div>
        </div>

      </div>
    </div>
  `
})
export class VerifyCertificatComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  public code = '';
  public lastSearchedCode = '';
  public loading = signal(false);
  public result = signal<CertificatVerificationResponse | null>(null);
  public errorState = signal(false);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.code = params['code'];
        this.verifier();
      }
    });
  }

  verifier() {
    if (!this.code.trim()) {
      this.toast.error('Veuillez saisir un code de certificat.');
      return;
    }

    this.loading.set(true);
    this.errorState.set(false);
    this.result.set(null);
    this.lastSearchedCode = this.code.trim();

    this.api.verifierCertificat(this.lastSearchedCode).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.result.set(res);
        this.toast.success('Certificat vérifié et authentifié !');
      },
      error: () => {
        this.loading.set(false);
        this.errorState.set(true);
        this.toast.error('Certificat introuvable.');
      }
    });
  }
}
