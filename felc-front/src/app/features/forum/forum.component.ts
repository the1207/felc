import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SujetResponse, SujetDetailResponse, DomaineResponse } from '../../core/models/models';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="background-color: var(--slate-50); min-height: 85vh;">
      <div class="app-container">
        
        <!-- Header -->
        <div style="margin-bottom: 2.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge badge-primary" style="margin-bottom: 0.5rem;">Entraide & Mentorat</span>
            <h1 style="font-size: 2.35rem; margin-bottom: 0.25rem;">Forum Communautaire FELC</h1>
            <p style="color: var(--slate-600); font-size: 1.05rem;">
              Échangez avec vos pairs, posez vos questions techniques et recevez l'aide d'experts et de formateurs.
            </p>
          </div>
          <button (click)="openNewTopicModal()" class="btn btn-primary btn-lg" style="box-shadow: var(--shadow-glow);">
            💬 Poser une question
          </button>
        </div>

        <!-- Filter Pills -->
        <div class="card" style="margin-bottom: 2rem; padding: 1rem 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">Filière :</span>
            <button 
              (click)="selectDomaine(null)" 
              class="badge" 
              [ngClass]="selectedDomaineId === null ? 'badge-primary' : 'badge-slate'"
              style="cursor: pointer; border: none; padding: 0.35rem 0.75rem;"
            >
              Toutes les discussions
            </button>
            <button 
              *ngFor="let dom of domaines()" 
              (click)="selectDomaine(dom.id)" 
              class="badge" 
              [ngClass]="selectedDomaineId === dom.id ? 'badge-primary' : 'badge-slate'"
              style="cursor: pointer; border: none; padding: 0.35rem 0.75rem;"
            >
              {{ dom.nom }}
            </button>
          </div>
        </div>

        <!-- Layout: If a topic is selected, view detail. Otherwise list topics -->
        <div *ngIf="selectedSujet(); else listTpl">
          
          <div style="margin-bottom: 1.5rem;">
            <button (click)="selectedSujet.set(null)" class="btn btn-outline btn-sm">
              ← Retour à toutes les discussions
            </button>
          </div>

          <!-- Main Question Card -->
          <div class="card" style="margin-bottom: 2rem; border-left: 6px solid var(--primary-600); box-shadow: var(--shadow-md);">
            <div class="card-body" style="padding: 2.25rem;">
              
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span class="badge badge-primary">{{ selectedSujet()?.domaineNom }}</span>
                  <span class="badge" [ngClass]="selectedSujet()?.resolu ? 'badge-success' : 'badge-warning'">
                    {{ selectedSujet()?.resolu ? 'RÉSOLU ✓' : 'EN DISCUSSION' }}
                  </span>
                </div>
                <div style="font-size: 0.825rem; color: var(--slate-500);">
                  Publié le {{ selectedSujet()?.dateCreation | date:'medium' }}
                </div>
              </div>

              <h2 style="font-size: 1.85rem; margin-bottom: 1rem; color: var(--slate-900);">
                {{ selectedSujet()?.titre }}
              </h2>

              <div style="color: var(--slate-800); font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.5rem; white-space: pre-wrap;">
                {{ selectedSujet()?.contenu }}
              </div>

              <div style="display: flex; align-items: center; gap: 0.75rem; border-top: 1px solid var(--slate-100); padding-top: 1rem;">
                <div style="width: 2.25rem; height: 2.25rem; border-radius: 50%; background: var(--primary-100); color: var(--primary-700); display: flex; align-items: center; justify-content: center; font-weight: 700;">
                  {{ selectedSujet()?.auteurPrenom?.charAt(0) }}
                </div>
                <div>
                  <div style="font-weight: 700; font-size: 0.9rem; color: var(--slate-900);">
                    {{ selectedSujet()?.auteurPrenom }} {{ selectedSujet()?.auteurNom }}
                  </div>
                  <span class="badge badge-slate" style="font-size: 0.65rem;">
                    {{ selectedSujet()?.auteurRole }}
                  </span>
                </div>
              </div>

            </div>
          </div>

          <!-- Answers List -->
          <div style="margin-bottom: 2.5rem;">
            <h3 style="font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--slate-900);">
              Réponses & Échanges ({{ selectedSujet()?.messages?.length || 0 }})
            </h3>

            <div *ngIf="selectedSujet()?.messages?.length; else noRepliesTpl" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div 
                *ngFor="let msg of selectedSujet()?.messages" 
                class="card"
                [style.border]="msg.estSolution ? '2px solid var(--accent-500)' : '1px solid var(--slate-200)'"
                [style.background]="msg.estSolution ? 'var(--accent-50)' : '#ffffff'"
              >
                <div class="card-body">
                  
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                      <div style="width: 2rem; height: 2rem; border-radius: 50%; background: var(--slate-200); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem;">
                        {{ msg.auteurPrenom?.charAt(0) }}
                      </div>
                      <div>
                        <strong>{{ msg.auteurPrenom }} {{ msg.auteurNom }}</strong>
                        <span class="badge badge-slate" style="margin-left: 0.5rem; font-size: 0.65rem;">{{ msg.auteurRole }}</span>
                      </div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span *ngIf="msg.estSolution" class="badge badge-success" style="font-size: 0.75rem;">
                        🏆 SOLUTION ACCEPTÉE
                      </span>
                      <span style="font-size: 0.75rem; color: var(--slate-400);">
                        {{ msg.dateCreation | date:'short' }}
                      </span>
                    </div>
                  </div>

                  <div style="font-size: 0.95rem; line-height: 1.6; color: var(--slate-800); white-space: pre-wrap; margin-bottom: 0.75rem;">
                    {{ msg.contenu }}
                  </div>

                  <!-- Mark as solution button -->
                  <div *ngIf="!msg.estSolution && (auth.currentUser()?.email === selectedSujet()?.auteurNom || auth.userRole() === 'ADMIN')" style="border-top: 1px solid var(--slate-100); padding-top: 0.5rem;">
                    <button (click)="marquerSolution(msg.id)" class="btn btn-outline btn-sm" style="color: var(--accent-700); border-color: var(--accent-400);">
                      ✅ Marquer comme solution validée
                    </button>
                  </div>

                </div>
              </div>
            </div>

            <ng-template #noRepliesTpl>
              <div class="card" style="padding: 2rem; text-align: center; color: var(--slate-500);">
                Aucune réponse pour le moment. Soyez le premier à apporter votre aide !
              </div>
            </ng-template>
          </div>

          <!-- Reply Form -->
          <div class="card" style="box-shadow: var(--shadow-sm);">
            <div class="card-body">
              <h4 style="font-size: 1.15rem; margin-bottom: 1rem;">Ajouter votre réponse</h4>
              
              <div *ngIf="auth.isLoggedIn(); else loginToReplyTpl">
                <form (ngSubmit)="envoyerReponse()">
                  <div class="form-group">
                    <textarea 
                      name="reponseContenu" 
                      [(ngModel)]="reponseContenu" 
                      required 
                      class="form-textarea" 
                      placeholder="Partagez votre solution, des extraits de code ou vos conseils bienveillants..."
                    ></textarea>
                  </div>
                  <div style="text-align: right;">
                    <button type="submit" [disabled]="submittingReply()" class="btn btn-primary">
                      <span *ngIf="submittingReply()" class="spinner"></span>
                      <span *ngIf="!submittingReply()">Envoyer ma réponse</span>
                    </button>
                  </div>
                </form>
              </div>

              <ng-template #loginToReplyTpl>
                <div style="font-size: 0.9rem; color: var(--slate-600);">
                  <a routerLink="/auth/login" style="font-weight: 700;">Connectez-vous</a> pour participer à cette discussion.
                </div>
              </ng-template>

            </div>
          </div>

        </div>

        <!-- Discussion Topics List -->
        <ng-template #listTpl>
          <div *ngIf="sujets().length > 0; else noTopicsTpl" style="display: flex; flex-direction: column; gap: 1rem;">
            <div *ngFor="let s of sujets()" (click)="ouvrirSujet(s.id)" class="card card-hover" style="cursor: pointer;">
              <div class="card-body" style="padding: 1.5rem;">
                
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="badge badge-primary">{{ s.domaineNom }}</span>
                    <span class="badge" [ngClass]="s.resolu ? 'badge-success' : 'badge-slate'">
                      {{ s.resolu ? 'RÉSOLU ✓' : 'EN COURS' }}
                    </span>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--slate-400);">
                    Dernière activité : {{ s.dateDerniereActivite | date:'short' }}
                  </div>
                </div>

                <h3 style="font-size: 1.25rem; margin-bottom: 0.4rem; color: var(--slate-900);">
                  {{ s.titre }}
                </h3>

                <p style="color: var(--slate-600); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1rem;">
                  {{ s.contenu.slice(0, 160) }}...
                </p>

                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--slate-100); padding-top: 0.75rem; font-size: 0.825rem; color: var(--slate-500);">
                  <div>
                    Par <strong>{{ s.auteurPrenom }} {{ s.auteurNom }}</strong> ({{ s.auteurRole }})
                  </div>
                  <div style="font-weight: 700; color: var(--primary-600); display: flex; align-items: center; gap: 0.3rem;">
                    💬 {{ s.nbReponses }} réponse(s)
                  </div>
                </div>

              </div>
            </div>
          </div>

          <ng-template #noTopicsTpl>
            <div class="card" style="padding: 4rem 2rem; text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">💬</div>
              <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Aucun sujet de discussion dans cette filière</h3>
              <p style="color: var(--slate-500); margin-bottom: 1.5rem;">
                Soyez le premier à poser une question pour lancer la conversation !
              </p>
              <button (click)="openNewTopicModal()" class="btn btn-primary">
                Poser une question
              </button>
            </div>
          </ng-template>
        </ng-template>

      </div>
    </div>

    <!-- New Topic Modal -->
    <div *ngIf="showNewTopicModal" class="modal-overlay">
      <div class="modal-content" style="padding: 2.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.35rem; margin: 0;">Poser une question sur le Forum</h3>
          <button (click)="showNewTopicModal = false" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        </div>

        <form (ngSubmit)="creerNouveauSujet()">
          <div class="form-group">
            <label class="form-label">Titre de votre question</label>
            <input type="text" name="titre" [(ngModel)]="nouveauSujetTitre" required class="form-input" placeholder="Ex : Comment gérer les clés étrangères en cascade avec Spring Boot JPA ?">
          </div>

          <div class="form-group">
            <label class="form-label">Filière / Domaine</label>
            <select name="domaineId" [(ngModel)]="nouveauSujetDomaineId" class="form-select" required>
              <option *ngFor="let dom of domaines()" [ngValue]="dom.id">{{ dom.nom }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Détaillez votre question ou problème</label>
            <textarea name="contenu" [(ngModel)]="nouveauSujetContenu" required class="form-textarea" style="min-height: 140px;" placeholder="Donnez le contexte, vos tests déjà réalisés et ce que vous essayez d'accomplir..."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" (click)="showNewTopicModal = false" class="btn btn-outline">Annuler</button>
            <button type="submit" [disabled]="submittingTopic()" class="btn btn-primary">
              <span *ngIf="submittingTopic()" class="spinner"></span>
              <span *ngIf="!submittingTopic()">Publier la discussion</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ForumComponent implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService);
  private toast = inject(ToastService);

  public sujets = signal<SujetResponse[]>([]);
  public domaines = signal<DomaineResponse[]>([]);
  public selectedDomaineId: number | null = null;
  public selectedSujet = signal<SujetDetailResponse | null>(null);

  // New topic modal
  public showNewTopicModal = false;
  public nouveauSujetTitre = '';
  public nouveauSujetDomaineId = 1;
  public nouveauSujetContenu = '';
  public submittingTopic = signal(false);

  // Reply form
  public reponseContenu = '';
  public submittingReply = signal(false);

  ngOnInit() {
    this.chargerSujets();
    this.api.getDomaines().subscribe({
      next: data => {
        this.domaines.set(data);
        if (data.length > 0) this.nouveauSujetDomaineId = data[0].id;
      }
    });
  }

  chargerSujets() {
    this.api.getSujets(this.selectedDomaineId || undefined).subscribe({
      next: data => this.sujets.set(data)
    });
  }

  selectDomaine(id: number | null) {
    this.selectedDomaineId = id;
    this.selectedSujet.set(null);
    this.chargerSujets();
  }

  ouvrirSujet(id: number) {
    this.api.getSujetById(id).subscribe({
      next: data => this.selectedSujet.set(data)
    });
  }

  openNewTopicModal() {
    if (!this.auth.isLoggedIn()) {
      this.toast.info('Veuillez vous connecter pour poser une question sur le forum.');
      return;
    }
    this.showNewTopicModal = true;
  }

  creerNouveauSujet() {
    if (!this.nouveauSujetTitre || !this.nouveauSujetContenu) {
      this.toast.error('Veuillez renseigner un titre et un contenu.');
      return;
    }

    this.submittingTopic.set(true);
    this.api.creerSujet({
      titre: this.nouveauSujetTitre,
      contenu: this.nouveauSujetContenu,
      domaineId: this.nouveauSujetDomaineId
    }).subscribe({
      next: (res) => {
        this.submittingTopic.set(false);
        this.showNewTopicModal = false;
        this.toast.success('Discussion publiée avec succès !');
        this.chargerSujets();
        this.ouvrirSujet(res.id);
      },
      error: (err) => {
        this.submittingTopic.set(false);
        const msg = err.error?.message || 'Erreur lors de la création du sujet.';
        this.toast.error(msg);
      }
    });
  }

  envoyerReponse() {
    const sId = this.selectedSujet()?.id;
    if (!sId || !this.reponseContenu.trim()) return;

    this.submittingReply.set(true);
    this.api.repondreSujet(sId, { contenu: this.reponseContenu }).subscribe({
      next: () => {
        this.submittingReply.set(false);
        this.reponseContenu = '';
        this.toast.success('Votre réponse a été postée !');
        this.ouvrirSujet(sId);
      },
      error: (err) => {
        this.submittingReply.set(false);
        const msg = err.error?.message || 'Erreur lors de l\'envoi de la réponse.';
        this.toast.error(msg);
      }
    });
  }

  marquerSolution(messageId: number) {
    this.api.marquerSolution(messageId).subscribe({
      next: () => {
        this.toast.success('Réponse validée comme solution acceptée ! 🏆');
        const sId = this.selectedSujet()?.id;
        if (sId) this.ouvrirSujet(sId);
      }
    });
  }
}
