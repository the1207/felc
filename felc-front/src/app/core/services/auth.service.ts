import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, Role } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly STORAGE_KEY = 'felc_auth_user';

  // Reactive state
  public currentUser = signal<AuthResponse | null>(this.loadUserFromStorage());
  public isLoggedIn = computed(() => !!this.currentUser());
  public userRole = computed<Role | null>(() => this.currentUser()?.role ?? null);
  public userFullName = computed(() => {
    const user = this.currentUser();
    return user ? `${user.prenom} ${user.nom}` : '';
  });

  private loadUserFromStorage(): AuthResponse | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  login(credentials: { email: string; motDePasse: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap(response => {
        this.saveAuth(response);
      })
    );
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/register', data).pipe(
      tap(response => {
        this.saveAuth(response);
      })
    );
  }

  private saveAuth(response: AuthResponse) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response));
    this.currentUser.set(response);
  }

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.currentUser()?.token ?? null;
  }

  hasRole(role: Role): boolean {
    return this.userRole() === role;
  }
}
