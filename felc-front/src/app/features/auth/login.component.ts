import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="background: linear-gradient(135deg, var(--slate-100), var(--primary-50)); min-height: 80vh; display: flex; align-items: center;">
      <div class="app-container" style="max-width: 480px; width: 100%;">
        
        <div class="card" style="box-shadow: var(--shadow-xl); border: 1px solid var(--slate-200);">
          <div class="card-body" style="padding: 2.25rem;">
            
            <div style="text-align: center; margin-bottom: 2rem;">
              <div style="width: 3.5rem; height: 3.5rem; border-radius: var(--radius-2xl); background: linear-gradient(135deg, var(--primary-600), var(--accent-500)); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin: 0 auto 1rem auto; box-shadow: var(--shadow-md);">
                ⚡
              </div>
              <h1 style="font-size: 1.75rem; margin-bottom: 0.4rem;">Connexion</h1>
              <p style="color: var(--slate-600); font-size: 0.9rem;">
                Accédez à votre espace d'apprentissage ou recruteur
              </p>
            </div>

            <!-- Demo Account Quick Selector for Evaluators -->
            <div style="background: var(--slate-50); border: 1px dashed var(--slate-300); border-radius: var(--radius-lg); padding: 0.85rem; margin-bottom: 1.5rem;">
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--slate-600); text-transform: uppercase; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
                <span>🎯</span> Raccourcis Comptes Démo (Hackathon) :
              </div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.4rem;">
                <button type="button" (click)="fillDemo('admin@felc.com', 'adminpassword123')" class="btn btn-outline btn-sm" style="font-size: 0.75rem; justify-content: flex-start;">
                  👑 Admin
                </button>
                <button type="button" (click)="fillDemo('formateur@felc.com', 'formateur123')" class="btn btn-outline btn-sm" style="font-size: 0.75rem; justify-content: flex-start;">
                  👨‍🏫 Formateur
                </button>
                <button type="button" (click)="fillDemo('entreprise@felc.com', 'entreprise123')" class="btn btn-outline btn-sm" style="font-size: 0.75rem; justify-content: flex-start;">
                  🏢 Entreprise
                </button>
                <button type="button" (click)="fillDemo('apprenant@felc.com', 'apprenant123')" class="btn btn-outline btn-sm" style="font-size: 0.75rem; justify-content: flex-start;">
                  🎓 Apprenant
                </button>
              </div>
            </div>

            <form (ngSubmit)="onSubmit()">
              
              <div class="form-group">
                <label class="form-label">Adresse E-mail</label>
                <input 
                  type="email" 
                  name="email" 
                  [(ngModel)]="email" 
                  required 
                  class="form-input" 
                  placeholder="nom@exemple.com"
                >
              </div>

              <div class="form-group">
                <label class="form-label">Mot de passe</label>
                <input 
                  type="password" 
                  name="motDePasse" 
                  [(ngModel)]="motDePasse" 
                  required 
                  class="form-input" 
                  placeholder="••••••••"
                >
              </div>

              <button 
                type="submit" 
                [disabled]="loading()" 
                class="btn btn-primary" 
                style="width: 100%; padding: 0.75rem; font-size: 1rem; margin-top: 0.5rem;"
              >
                <span *ngIf="loading()" class="spinner"></span>
                <span *ngIf="!loading()">Se connecter</span>
              </button>

            </form>

            <div style="text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--slate-600);">
              Pas encore de compte ? 
              <a routerLink="/auth/register" style="font-weight: 700; color: var(--primary-600);">
                Créer un compte
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public email = '';
  public motDePasse = '';
  public loading = signal(false);

  fillDemo(email: string, pass: string) {
    this.email = email;
    this.motDePasse = pass;
    this.toast.info(`Identifiants ${email} pré-remplis.`);
  }

  onSubmit() {
    if (!this.email || !this.motDePasse) {
      this.toast.error('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    this.loading.set(true);
    this.authService.login({ email: this.email, motDePasse: this.motDePasse }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.toast.success(`Bienvenue, ${res.prenom} ${res.nom} !`);
        
        // Redirection contextuelle selon le rôle
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else if (res.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (res.role === 'FORMATEUR') {
          this.router.navigate(['/formateur/dashboard']);
        } else if (res.role === 'ENTREPRISE') {
          this.router.navigate(['/entreprise/offres']);
        } else {
          this.router.navigate(['/mes-formations']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err.error?.message || 'Identifiants invalides. Vérifiez votre email et mot de passe.';
        this.toast.error(msg);
      }
    });
  }
}
