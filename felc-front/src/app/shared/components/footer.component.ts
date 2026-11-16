import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer style="background-color: var(--slate-900); color: var(--slate-400); border-top: 1px solid var(--slate-800); padding-top: 4rem; padding-bottom: 2.5rem; margin-top: auto;">
      <div class="app-container">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8" style="margin-bottom: 3rem;">
          
          <!-- Column 1: Brand Info -->
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--primary-500), var(--accent-400)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 1rem;">
                ⚡
              </div>
              <span style="font-family: var(--font-sans); font-size: 1.25rem; font-weight: 800; color: #ffffff;">
                FELC<span style="color: var(--accent-400);">.</span>
              </span>
            </div>
            <p style="font-size: 0.875rem; line-height: 1.6; color: var(--slate-400);">
              Plateforme d'apprentissage 100% pratique, d'orientation IA, de certification infalsifiable et d'insertion professionnelle pour la jeunesse francophone.
            </p>
            <div style="font-size: 0.8rem; color: var(--slate-500);">
              📍 Fièrement conçu pour le Togo et l'Afrique francophone.
            </div>
          </div>

          <!-- Column 2: Apprentissage -->
          <div>
            <h4 style="color: #ffffff; font-size: 0.95rem; margin-bottom: 1.25rem; font-weight: 700;">Apprentissage</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem;">
              <li><a routerLink="/formations" style="color: var(--slate-400);">Catalogue de Formations</a></li>
              <li><a routerLink="/orientation" style="color: var(--accent-400); font-weight: 600;">✨ Diagnostic & Orientation IA</a></li>
              <li><a routerLink="/mes-formations" style="color: var(--slate-400);">Projets & Exercices Pratiques</a></li>
              <li><a routerLink="/forum" style="color: var(--slate-400);">Forum d'Entraide Communautaire</a></li>
            </ul>
          </div>

          <!-- Column 3: Emploi & Entreprises -->
          <div>
            <h4 style="color: #ffffff; font-size: 0.95rem; margin-bottom: 1.25rem; font-weight: 700;">Opportunités & Entreprises</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem;">
              <li><a routerLink="/offres" style="color: var(--slate-400);">Offres d'Emploi & Stages</a></li>
              <li><a routerLink="/offres" [queryParams]="{ type: 'MISSION' }" style="color: var(--slate-400);">Missions Freelance (FCFA)</a></li>
              <li><a routerLink="/certificats/verify" style="color: var(--slate-400);">Vérification de Certificat</a></li>
              <li><a routerLink="/auth/register" style="color: var(--slate-400);">Espace Recruteur</a></li>
            </ul>
          </div>

          <!-- Column 4: Innovation & Valeurs -->
          <div>
            <h4 style="color: #ffffff; font-size: 0.95rem; margin-bottom: 1.25rem; font-weight: 700;">Les Piliers FELC</h4>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.825rem;">
              <div style="background: rgba(255,255,255,0.05); padding: 0.6rem 0.8rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.1);">
                <strong style="color: #ffffff;">0% Quiz passif</strong> — 100% de code & projets concrets.
              </div>
              <div style="background: rgba(255,255,255,0.05); padding: 0.6rem 0.8rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.1);">
                <strong style="color: #ffffff;">Correction IA Claude</strong> — Feedback GitHub instantané.
              </div>
              <div style="background: rgba(255,255,255,0.05); padding: 0.6rem 0.8rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.1);">
                <strong style="color: #ffffff;">Preuve Publique</strong> — Certificat unique FELC-DOM-ID.
              </div>
            </div>
          </div>

        </div>

        <div style="border-top: 1px solid var(--slate-800); padding-top: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; font-size: 0.825rem; color: var(--slate-500);">
          <div>
            © 2026 FELC. Tous droits réservés. Hackathon Togo & Afrique Francophone.
          </div>
          <div style="display: flex; gap: 1.5rem;">
            <span>Sécurisé par JWT & Supabase</span>
            <span>Propulsé par Anthropic Claude</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
