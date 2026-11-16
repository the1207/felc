import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header style="background: rgba(11, 17, 32, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); position: sticky; top: 0; z-index: 50;">
      <div class="app-container" style="display: flex; align-items: center; justify-content: space-between; height: 4.75rem;">
        
        <!-- Futuristic Brand Logo -->
        <a routerLink="/" style="display: flex; align-items: center; gap: 0.85rem; text-decoration: none;">
          <div style="width: 2.85rem; height: 2.85rem; border-radius: var(--radius-xl); background: var(--grad-cyber); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 1.35rem; box-shadow: 0 0 20px rgba(6, 182, 212, 0.5);">
            ⚡
          </div>
          <div>
            <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -0.04em; color: #ffffff; line-height: 1; display: flex; align-items: center; gap: 0.2rem;">
              FELC<span style="color: var(--neon-cyan);">.AI</span>
              <span class="pulsing-dot" style="margin-left: 0.4rem;" title="Système opérationnel"></span>
            </div>
            <div style="font-size: 0.68rem; font-weight: 700; color: var(--neon-cyan); letter-spacing: 0.1em; text-transform: uppercase;">
              Formation & Emploi
            </div>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav style="display: none; align-items: center; gap: 2rem;" class="md:flex">
          <a routerLink="/formations" routerLinkActive="active-nav" style="font-family: var(--font-display); font-weight: 600; font-size: 0.95rem; color: #cbd5e1;">
            Formations
          </a>
          <a routerLink="/offres" routerLinkActive="active-nav" style="font-family: var(--font-display); font-weight: 600; font-size: 0.95rem; color: #cbd5e1;">
            Offres & Missions
          </a>
          <a routerLink="/forum" routerLinkActive="active-nav" style="font-family: var(--font-display); font-weight: 600; font-size: 0.95rem; color: #cbd5e1;">
            Forum
          </a>
          <a routerLink="/certificats/verify" routerLinkActive="active-nav" style="font-family: var(--font-display); font-weight: 600; font-size: 0.95rem; color: #cbd5e1;">
            Vérifier Certificat
          </a>
          <a 
            routerLink="/orientation" 
            routerLinkActive="active-nav" 
            class="badge badge-cyber"
            style="padding: 0.45rem 1rem; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; cursor: pointer;"
          >
            <span>✨</span> Moteur IA
          </a>
        </nav>

        <!-- Right Side: User Status & Actions -->
        <div style="display: flex; align-items: center; gap: 1rem;">
          
          <ng-container *ngIf="authService.isLoggedIn(); else guestTpl">
            
            <!-- Quick links according to role -->
            <div style="display: none; align-items: center; gap: 0.6rem;" class="md:flex">
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
                class="btn btn-primary btn-sm"
              >
                ⚙️ Admin Console
              </a>
            </div>

            <!-- User Pill -->
            <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.35rem 0.85rem; background: rgba(255, 255, 255, 0.05); border-radius: var(--radius-full); border: 1px solid rgba(255, 255, 255, 0.12); backdrop-filter: blur(12px);">
              <div style="width: 2rem; height: 2rem; border-radius: 50%; background: var(--grad-cyber); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800; font-family: var(--font-display);">
                {{ authService.currentUser()?.prenom?.charAt(0) }}{{ authService.currentUser()?.nom?.charAt(0) }}
              </div>
              <div style="display: none;" class="md:block">
                <div style="font-size: 0.85rem; font-weight: 700; color: #ffffff; line-height: 1.1;">
                  {{ authService.userFullName() }}
                </div>
                <div style="font-size: 0.68rem; font-weight: 700;" [ngClass]="getRoleBadgeClass(authService.userRole())">
                  {{ authService.userRole() }}
                </div>
              </div>
              <button 
                (click)="authService.logout()" 
                title="Déconnexion"
                style="background: none; border: none; cursor: pointer; color: var(--text-dim); font-size: 1.1rem; padding: 0.1rem; line-height: 1;"
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
              <a routerLink="/auth/register" class="btn btn-cyber btn-sm">
                S'inscrire ⚡
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
      <div *ngIf="mobileMenuOpen()" style="border-top: 1px solid rgba(255, 255, 255, 0.1); background: rgba(11, 17, 32, 0.98); backdrop-filter: blur(24px); padding: 1.5rem;">
        <div style="display: flex; flex-direction: column; gap: 1.2rem;">
          <a routerLink="/formations" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: #ffffff;">📚 Catalogue Formations</a>
          <a routerLink="/offres" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: #ffffff;">💼 Offres & Missions Freelance</a>
          <a routerLink="/forum" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: #ffffff;">💬 Forum Communautaire</a>
          <a routerLink="/orientation" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: var(--neon-cyan);">✨ Moteur d'Orientation IA</a>
          <a routerLink="/certificats/verify" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: #ffffff;">🛡️ Vérifier un Certificat</a>

          <div *ngIf="authService.isLoggedIn()" style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.85rem;">
            <a *ngIf="authService.userRole() === 'APPRENANT'" routerLink="/mes-formations" (click)="mobileMenuOpen.set(false)">🎓 Mes Cours & Exercices</a>
            <a *ngIf="authService.userRole() === 'APPRENANT'" routerLink="/portfolio/me" (click)="mobileMenuOpen.set(false)">📁 Mon Portfolio Public</a>
            <a *ngIf="authService.userRole() === 'FORMATEUR'" routerLink="/formateur/dashboard" (click)="mobileMenuOpen.set(false)">👨‍🏫 Espace Formateur</a>
            <a *ngIf="authService.userRole() === 'ENTREPRISE'" routerLink="/entreprise/offres" (click)="mobileMenuOpen.set(false)">🏢 Gérer mes Offres</a>
            <a *ngIf="authService.userRole() === 'ADMIN'" routerLink="/admin" (click)="mobileMenuOpen.set(false)">⚙️ Console Administrateur</a>
          </div>
        </div>
      </div>

    </header>
  `,
  styles: [`
    .active-nav {
      color: var(--neon-cyan) !important;
      text-shadow: 0 0 12px rgba(6, 182, 212, 0.6);
      border-bottom: 2px solid var(--neon-cyan);
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
