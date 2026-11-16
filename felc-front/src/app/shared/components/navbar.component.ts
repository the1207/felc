import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header style="background: #ffffff; border-bottom: 1px solid var(--slate-200); position: sticky; top: 0; z-index: 50; box-shadow: var(--shadow-xs);">
      <div class="app-container" style="display: flex; align-items: center; justify-content: space-between; height: 4.5rem;">
        
        <!-- Brand Logo -->
        <a routerLink="/" style="display: flex; align-items: center; gap: 0.75rem; text-decoration: none;">
          <div style="width: 2.75rem; height: 2.75rem; border-radius: var(--radius-xl); background: linear-gradient(135deg, var(--primary-600), var(--accent-500)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 1.25rem; box-shadow: var(--shadow-sm);">
            ⚡
          </div>
          <div>
            <div style="font-family: var(--font-sans); font-size: 1.35rem; font-weight: 800; letter-spacing: -0.03em; color: var(--slate-900); line-height: 1;">
              FELC<span style="color: var(--primary-600);">.</span>
            </div>
            <div style="font-size: 0.7rem; font-weight: 600; color: var(--slate-500); letter-spacing: 0.05em; text-transform: uppercase;">
              Formation & Emploi
            </div>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav style="display: none; align-items: center; gap: 1.75rem;" class="md:flex">
          <a routerLink="/formations" routerLinkActive="active-nav" style="font-weight: 600; font-size: 0.925rem; color: var(--slate-600);">
            Formations
          </a>
          <a routerLink="/offres" routerLinkActive="active-nav" style="font-weight: 600; font-size: 0.925rem; color: var(--slate-600);">
            Offres d'Emploi
          </a>
          <a routerLink="/forum" routerLinkActive="active-nav" style="font-weight: 600; font-size: 0.925rem; color: var(--slate-600);">
            Forum
          </a>
          <a routerLink="/certificats/verify" routerLinkActive="active-nav" style="font-weight: 600; font-size: 0.925rem; color: var(--slate-600);">
            Vérifier Certificat
          </a>
          <a 
            routerLink="/orientation" 
            routerLinkActive="active-nav" 
            style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.85rem; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--primary-50), var(--accent-50)); border: 1px solid var(--primary-200); font-size: 0.85rem; font-weight: 700; color: var(--primary-700);"
          >
            <span>✨</span> Orientation IA
          </a>
        </nav>

        <!-- Right Side: User Status & Actions -->
        <div style="display: flex; align-items: center; gap: 1rem;">
          
          <ng-container *ngIf="authService.isLoggedIn(); else guestTpl">
            
            <!-- Quick links according to role -->
            <div style="display: none; align-items: center; gap: 0.5rem;" class="md:flex">
              <a 
                *ngIf="authService.userRole() === 'APPRENANT'" 
                routerLink="/mes-formations" 
                class="btn btn-outline btn-sm"
              >
                🎓 Mes Cours
              </a>
              <a 
                *ngIf="authService.userRole() === 'APPRENANT'" 
                routerLink="/portfolio/me" 
                class="btn btn-outline btn-sm"
              >
                💼 Mon Portfolio
              </a>
              <a 
                *ngIf="authService.userRole() === 'FORMATEUR'" 
                routerLink="/formateur/dashboard" 
                class="btn btn-outline btn-sm"
              >
                👨‍🏫 Espace Formateur
              </a>
              <a 
                *ngIf="authService.userRole() === 'ENTREPRISE'" 
                routerLink="/entreprise/offres" 
                class="btn btn-outline btn-sm"
              >
                🏢 Mes Offres
              </a>
              <a 
                *ngIf="authService.userRole() === 'ADMIN'" 
                routerLink="/admin" 
                class="btn btn-accent btn-sm"
              >
                ⚙️ Administration
              </a>
            </div>

            <!-- User Pill -->
            <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.35rem 0.75rem; background: var(--slate-100); border-radius: var(--radius-full); border: 1px solid var(--slate-200);">
              <div style="width: 2rem; height: 2rem; border-radius: 50%; background: var(--primary-700); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700;">
                {{ authService.currentUser()?.prenom?.charAt(0) }}{{ authService.currentUser()?.nom?.charAt(0) }}
              </div>
              <div style="display: none;" class="md:block">
                <div style="font-size: 0.825rem; font-weight: 700; color: var(--slate-900); line-height: 1.1;">
                  {{ authService.userFullName() }}
                </div>
                <div style="font-size: 0.68rem; font-weight: 700;" [ngClass]="getRoleBadgeClass(authService.userRole())">
                  {{ authService.userRole() }}
                </div>
              </div>
              <button 
                (click)="authService.logout()" 
                title="Déconnexion"
                style="background: none; border: none; cursor: pointer; color: var(--slate-400); font-size: 1.1rem; padding: 0.1rem; line-height: 1;"
              >
                🚪
              </button>
            </div>

          </ng-container>

          <ng-template #guestTpl>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <a routerLink="/auth/login" class="btn btn-ghost btn-sm">
                Connexion
              </a>
              <a routerLink="/auth/register" class="btn btn-primary btn-sm">
                S'inscrire
              </a>
            </div>
          </ng-template>

          <!-- Mobile Menu Button -->
          <button 
            (click)="toggleMobileMenu()" 
            class="btn btn-ghost btn-sm"
            style="display: flex; padding: 0.4rem; font-size: 1.25rem;"
          >
            ☰
          </button>

        </div>

      </div>

      <!-- Mobile Dropdown Navigation -->
      <div *ngIf="mobileMenuOpen()" style="border-top: 1px solid var(--slate-200); background: #ffffff; padding: 1.25rem;">
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <a routerLink="/formations" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: var(--slate-700);">📚 Catalogue Formations</a>
          <a routerLink="/offres" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: var(--slate-700);">💼 Offres d'Emploi & Missions</a>
          <a routerLink="/forum" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: var(--slate-700);">💬 Forum Communautaire</a>
          <a routerLink="/orientation" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: var(--primary-600);">✨ Orientation IA</a>
          <a routerLink="/certificats/verify" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: var(--slate-700);">🔍 Vérifier un Certificat</a>

          <div *ngIf="authService.isLoggedIn()" style="border-top: 1px solid var(--slate-100); padding-top: 0.75rem; display: flex; flex-direction: column; gap: 0.75rem;">
            <a *ngIf="authService.userRole() === 'APPRENANT'" routerLink="/mes-formations" (click)="mobileMenuOpen.set(false)">🎓 Mes Cours & Exercices</a>
            <a *ngIf="authService.userRole() === 'APPRENANT'" routerLink="/portfolio/me" (click)="mobileMenuOpen.set(false)">📁 Mon Portfolio Public</a>
            <a *ngIf="authService.userRole() === 'FORMATEUR'" routerLink="/formateur/dashboard" (click)="mobileMenuOpen.set(false)">👨‍🏫 Espace Formateur</a>
            <a *ngIf="authService.userRole() === 'ENTREPRISE'" routerLink="/entreprise/offres" (click)="mobileMenuOpen.set(false)">🏢 Gérer mes Offres</a>
            <a *ngIf="authService.userRole() === 'ADMIN'" routerLink="/admin" (click)="mobileMenuOpen.set(false)">⚙️ Espace Administrateur</a>
          </div>
        </div>
      </div>

    </header>
  `,
  styles: [`
    .active-nav {
      color: var(--primary-600) !important;
      border-bottom: 2px solid var(--primary-600);
      padding-bottom: 0.25rem;
    }
  `]
})
export class NavbarComponent {
  public authService = inject(AuthService);
  public mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  getRoleBadgeClass(role: string | null): string {
    switch (role) {
      case 'ADMIN': return 'badge-danger';
      case 'FORMATEUR': return 'badge-purple';
      case 'ENTREPRISE': return 'badge-warning';
      default: return 'badge-success';
    }
  }
}
