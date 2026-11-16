import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { OrientationComponent } from './features/orientation/orientation.component';
import { FormationListComponent } from './features/formations/formation-list.component';
import { FormationDetailComponent } from './features/formations/formation-detail.component';
import { MesFormationsComponent } from './features/formations/mes-formations.component';
import { MesCertificatsComponent } from './features/certificats/mes-certificats.component';
import { VerifyCertificatComponent } from './features/certificats/verify-certificat.component';
import { OffreListComponent } from './features/offres/offre-list.component';
import { OffreDetailComponent } from './features/offres/offre-detail.component';
import { EntrepriseOffresComponent } from './features/offres/entreprise-offres.component';
import { ForumComponent } from './features/forum/forum.component';
import { PortfolioComponent } from './features/portfolio/portfolio.component';
import { FormateurDashboardComponent } from './features/formateur/formateur-dashboard.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { ImpactComponent } from './features/impact/impact.component';
import { BoursesComponent } from './features/bourses/bourses.component';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  
  // High Impact & Inclusion
  { path: 'impact', component: ImpactComponent },
  { path: 'bourses', component: BoursesComponent },

  // Auth
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },

  // Orientation IA
  { path: 'orientation', component: OrientationComponent },

  // Formations & Exercices
  { path: 'formations', component: FormationListComponent },
  { path: 'formations/:id', component: FormationDetailComponent },
  { path: 'mes-formations', component: MesFormationsComponent, canActivate: [authGuard] },

  // Certificats
  { path: 'mes-certificats', component: MesCertificatsComponent, canActivate: [authGuard] },
  { path: 'certificats/verify', component: VerifyCertificatComponent },

  // Emploi & Recrutement
  { path: 'offres', component: OffreListComponent },
  { path: 'offres/:id', component: OffreDetailComponent },
  { path: 'entreprise/offres', component: EntrepriseOffresComponent, canActivate: [roleGuard(['ENTREPRISE', 'ADMIN'])] },

  // Forum Communautaire
  { path: 'forum', component: ForumComponent },

  // Portfolio
  { path: 'portfolio/me', component: PortfolioComponent, canActivate: [authGuard] },
  { path: 'portfolio/:id', component: PortfolioComponent },

  // Formateur
  { path: 'formateur/dashboard', component: FormateurDashboardComponent, canActivate: [roleGuard(['FORMATEUR', 'ADMIN'])] },

  // Admin
  { path: 'admin', component: AdminDashboardComponent, canActivate: [roleGuard(['ADMIN'])] },

  // Fallback
  { path: '**', redirectTo: '' }
];
