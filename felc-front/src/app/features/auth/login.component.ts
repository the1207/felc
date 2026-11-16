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
    <div class="section-py" style="min-height: 85vh; display: flex; align-items: center; position: relative;">
      <div class="ambient-glow-top"></div>
      <div class="app-container" style="max-width: 500px; width: 100%;">
        
        <div class="card" style="box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.9), var(--glow-indigo);">
          <div class="card-body" style="padding: 2.5rem;">
            
            <div style="text-align: center; margin-bottom: 2rem;">
              <div style="width: 3.75rem; height: 3.75rem; border-radius: var(--radius-2xl); background: var(--grad-cyber); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto 1.25rem auto; box-shadow: 0 0 25px rgba(6, 182, 212, 0.5);">
                ⚡
              </div>
              <h1 style="font-size: 2rem; margin-bottom: 0.4rem; color: #ffffff;">Connexion</h1>
              <p style="color: #94a3b8; font-size: 0.95rem;">
                Accédez à votre espace apprenant, formateur ou recruteur
              </p>
            </div>

            <!-- Demo Account Quick Selector for Evaluators -->
            <div style="background: rgba(15, 23, 42, 0.8); border: 1px dashed rgba(99, 102, 241, 0.4); border-radius: var(--radius-xl); padding: 1rem; margin-bottom: 2rem;">
              <div style="font-size: 0.75rem; font-weight: 800; color: var(--neon-cyan); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                <span class="pulsing-dot"></span> Raccourcis Comptes Démo (Hackathon) :
              </div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
                <button type="button" (click)="fillDemo('admin@felc.com', 'adminpassword123')" class="btn btn-outline btn-sm" style="font-size: 0.8rem; justify-content: flex-start;">
                  👑 Admin
                </button>
                <button type="button" (click)="fillDemo('formateur@felc.com', 'formateur123')" class="btn btn-outline btn-sm" style="font-size: 0.8rem; justify-content: flex-start;">
                  👨‍🏫 Formateur
                </button>
                <button type="button" (click)="fillDemo('entreprise@felc.com', 'entreprise123')" class="btn btn-outline btn-sm" style="font-size: 0.8rem; justify-content: flex-start;">
                  🏢 Entreprise
                </button>
                <button type="button" (click)="fillDemo('apprenant@felc.com', 'apprenant123')" class="btn btn-outline btn-sm" style="font-size: 0.8rem; justify-content: flex-start;">
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
                class="btn btn-cyber" 
                style="width: 100%; padding: 0.85rem; font-size: 1.05rem; margin-top: 1rem;"
              >
                <span *ngIf="loading()" class="spinner"></span>
                <span *ngIf="!loading()">Se connecter ➔</span>
              </button>

            </form>

            <div style="text-align: center; margin-top: 2rem; font-size: 0.9rem; color: #94a3b8;">
              Pas encore de compte ? 
              <a routerLink="/auth/register" style="font-weight: 700; color: var(--neon-cyan);">
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
