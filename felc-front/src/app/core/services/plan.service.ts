import { Injectable, computed, signal } from '@angular/core';

export type PlanId = 'communaute' | 'talent' | 'organisation';

export interface PlanDefinition {
  id: PlanId;
  nom: string;
  pour: string;
  prix: string;
  rythme: string;
  promesse: string;
  inclus: string[];
}

const PLANS: PlanDefinition[] = [
  {
    id: 'communaute',
    nom: 'Communauté',
    pour: 'Tout apprenant',
    prix: '0 FCFA',
    rythme: 'toujours',
    promesse: 'Apprendre, prouver et postuler ne doit jamais dépendre d’un paiement.',
    inclus: [
      'Catalogue de formations pratiques',
      'Forum, portfolio et certificats vérifiables',
      'Candidatures aux offres et missions',
      'Mode économie de données',
      '1 orientation guidée par mois',
      '2 analyses d’entretien par mois',
      'Rédaction du CV à l’écran'
    ]
  },
  {
    id: 'talent',
    nom: 'Talent',
    pour: 'Apprenant qui prépare un recrutement',
    prix: '2 500 FCFA',
    rythme: 'par mois, tarif proposé',
    promesse: 'Les outils qui coûtent cher en calcul restent ouverts, sans fermer le socle gratuit.',
    inclus: [
      'Tout le plan Communauté, sans quota',
      'Orientation et entretiens illimités',
      'Export PDF du CV'
    ]
  },
  {
    id: 'organisation',
    nom: 'Organisation',
    pour: 'Entreprise ou formateur',
    prix: '15 000 FCFA',
    rythme: 'par mois, tarif proposé',
    promesse: 'Recruter et former sur des preuves, pas sur un CV déclaré.',
    inclus: [
      'Tout le plan Talent',
      'Même accès formateur ou recruteur, selon le rôle du compte',
      'Tarif prévu pour une structure, pas pour un apprenant seul'
    ]
  }
];

interface Usage {
  month: string;
  interviews: number;
  orientations: number;
}

@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly PLAN_KEY = 'felc_plan';
  private readonly USAGE_KEY = 'felc_usage';

  readonly catalog = PLANS;
  readonly planId = signal<PlanId>(this.readPlan());
  readonly usage = signal<Usage>(this.readUsage());

  readonly current = computed(() => PLANS.find(p => p.id === this.planId()) ?? PLANS[0]);
  readonly premium = computed(() => this.planId() !== 'communaute');

  readonly interviewsLeft = computed(() => {
    if (this.premium()) return null;
    return Math.max(0, 2 - this.usage().interviews);
  });

  readonly orientationsLeft = computed(() => {
    if (this.premium()) return null;
    return Math.max(0, 1 - this.usage().orientations);
  });

  select(id: PlanId) {
    localStorage.setItem(this.PLAN_KEY, id);
    this.planId.set(id);
  }

  canExportCv(): boolean {
    return this.premium();
  }

  tryConsumeInterview(): boolean {
    return this.consume('interviews', 2);
  }

  tryConsumeOrientation(): boolean {
    return this.consume('orientations', 1);
  }

  private consume(field: 'interviews' | 'orientations', freeLimit: number): boolean {
    const usage = this.freshUsage();
    if (!this.premium() && usage[field] >= freeLimit) {
      return false;
    }
    if (!this.premium()) {
      usage[field] += 1;
      localStorage.setItem(this.USAGE_KEY, JSON.stringify(usage));
      this.usage.set(usage);
    }
    return true;
  }

  private freshUsage(): Usage {
    const month = new Date().toISOString().slice(0, 7);
    const current = this.usage();
    if (current.month === month) return { ...current };
    const reset: Usage = { month, interviews: 0, orientations: 0 };
    this.usage.set(reset);
    return reset;
  }

  private readPlan(): PlanId {
    const stored = localStorage.getItem(this.PLAN_KEY);
    if (stored === 'talent' || stored === 'organisation' || stored === 'communaute') {
      return stored;
    }
    return 'communaute';
  }

  private readUsage(): Usage {
    const month = new Date().toISOString().slice(0, 7);
    try {
      const raw = localStorage.getItem(this.USAGE_KEY);
      if (!raw) return { month, interviews: 0, orientations: 0 };
      const parsed = JSON.parse(raw) as Usage;
      if (parsed.month !== month) return { month, interviews: 0, orientations: 0 };
      return parsed;
    } catch {
      return { month, interviews: 0, orientations: 0 };
    }
  }
}
