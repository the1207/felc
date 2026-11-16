import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlanId, PlanService } from '../../core/services/plan.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="section-py">
      <div class="app-container">
        <div style="max-width: 760px; margin: 0 auto 3rem; text-align: center;">
          <span class="badge badge-success">Trois offres, une même porte d’entrée</span>
          <h1 style="font-size: 2.6rem; margin: 1rem 0 0.85rem;">
            Gratuit pour apprendre. Payant seulement pour accélérer.
          </h1>
          <p style="color: var(--text-muted); font-size: 1.05rem;">
            Le plan Communauté couvre le parcours utile : se former, obtenir une preuve, postuler.
            Talent et Organisation débloquent ce qui consomme du calcul ou de la visibilité.
            Les montants sont des tarifs proposés. Aucun paiement n’est prélevé dans cette version.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article *ngFor="let plan of plans.catalog" class="card" [class.plan-current]="plans.planId() === plan.id" [class.plan-featured]="plan.id === 'talent'">
            <div class="card-body" style="display: flex; flex-direction: column; height: 100%; gap: 0.85rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="badge" [ngClass]="plan.id === 'communaute' ? 'badge-success' : plan.id === 'talent' ? 'badge-primary' : 'badge-warning'">
                  {{ plan.pour }}
                </span>
                <span *ngIf="plans.planId() === plan.id" class="badge badge-slate">Plan actif</span>
              </div>
              <h2 style="font-size: 1.6rem;">{{ plan.nom }}</h2>
              <div>
                <div style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800;">{{ plan.prix }}</div>
                <div style="color: var(--text-dim); font-size: 0.85rem;">{{ plan.rythme }}</div>
              </div>
              <p style="color: var(--text-muted); font-size: 0.95rem;">{{ plan.promesse }}</p>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.55rem; margin: 0.25rem 0 1rem; flex: 1;">
                <li *ngFor="let item of plan.inclus" style="color: #cbd5e1; font-size: 0.92rem;">{{ item }}</li>
              </ul>
              <button type="button" class="btn" [ngClass]="plans.planId() === plan.id ? 'btn-outline' : 'btn-cyber'" (click)="activer(plan.id)">
                {{ plans.planId() === plan.id ? 'Déjà actif' : 'Activer ce plan' }}
              </button>
            </div>
          </article>
        </div>

        <div class="card" style="margin-top: 2.5rem;">
          <div class="card-body" style="display: grid; gap: 1.25rem;">
            <div>
              <h2 style="font-size: 1.35rem; margin-bottom: 0.4rem;">Ce qui reste vrai, quel que soit le plan</h2>
              <p style="color: var(--text-muted);">
                Une formation validée produit le même certificat vérifiable.
                Une offre ouverte reste visible.
                Le mode économie de données n’est pas une option premium : il sert les connexions lentes.
                Une bourse peut offrir le plan Talent à quelqu’un qui n’a pas les 2 500 FCFA.
              </p>
            </div>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <a routerLink="/bourses" class="btn btn-outline">Voir les bourses</a>
              <a routerLink="/auth/register" class="btn btn-primary">Créer un compte Communauté</a>
              <a routerLink="/formations" class="btn btn-ghost">Entrer dans le catalogue</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PricingComponent {
  readonly plans = inject(PlanService);
  private toast = inject(ToastService);

  activer(id: PlanId) {
    this.plans.select(id);
    const nom = this.plans.catalog.find(p => p.id === id)?.nom ?? id;
    this.toast.success(`Plan ${nom} activé sur cet appareil. Aucun montant n’a été débité.`);
  }
}
