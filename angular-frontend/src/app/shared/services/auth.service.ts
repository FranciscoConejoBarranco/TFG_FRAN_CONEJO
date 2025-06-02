import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environment/environment';
import { LoginInterface } from '../interfaces/login-interface';
import {jwtDecode} from 'jwt-decode';

export interface MeResponse {
  id: number;
  name: string;
  role: string[];
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: MeResponse | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginInterface): Observable<any> {
    return this.http.post(`${environment.api}auth/login`, credentials, {
      withCredentials: true,
    }).pipe(
      tap(() => {
        // Debug: Ver qué cookies se establecieron después del login
        console.log('Cookies después del login:', document.cookie);
      })
    );
  }

  fetchUser(): Observable<MeResponse | null> {
    return this.http.get<MeResponse>(`${environment.api}auth/me`, {
      withCredentials: true,
    }).pipe(
      tap(user => this.user = user),
      catchError(err => {
        console.error('Error al obtener usuario:', err);
        this.user = null;
        return of(null);
      })
    );
  }

  getUser(): MeResponse | null {
    return this.user;
  }

  getDecodedToken(): any {
    // Usar 'X-AUTH-TOKEN' que es el nombre correcto de la cookie
    let token = this.getCookie('X-AUTH-TOKEN');
    
    // Fallback a otros nombres por si acaso
    if (!token) {
      token = this.getCookie('codearts_token');
    }
    if (!token) {
      token = this.getCookie('jwt_token');
    }
    if (!token) {
      token = this.getCookie('auth_token');
    }

    console.log('Token encontrado:', token ? 'SÍ' : 'NO');
    return token ? jwtDecode(token) : null;
  }
  
  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  // Método para debugging - llamar después del login
  debugCookies(): void {
    console.log('=== DEBUG COOKIES ===');
    console.log('Todas las cookies:', document.cookie);
    console.log('X-AUTH-TOKEN:', this.getCookie('X-AUTH-TOKEN'));
    console.log('codearts_token:', this.getCookie('codearts_token'));
    console.log('jwt_token:', this.getCookie('jwt_token'));
    console.log('auth_token:', this.getCookie('auth_token'));
    console.log('==================');
  }

  logout(): void {
    this.http.get(`${environment.api}auth/logout`, {
      withCredentials: true
    }).subscribe({
      next: () => {
        this.user = null;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en logout:', err);
        this.user = null;
        this.router.navigate(['/login']);
      }
    });
  }
  
  isLoggedIn(): boolean {
    return !!this.user;
  }

  getUserName(): string {
    if (this.user) {
      return this.user.name;
    } else {
      this.fetchUser().subscribe();
      return 'Cargando...';
    }
  }

  getUserRole(): string[] {
    return this.user?.role ?? [];
  }
}